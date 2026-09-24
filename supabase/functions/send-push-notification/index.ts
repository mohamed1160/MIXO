import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { JWT } from "https://esm.sh/google-auth-library@9.14.1";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const {
      user_id,
      title,
      body,
      data = {},
    } = await req.json();

    if (!user_id || !title || !body) {
      return new Response(
        JSON.stringify({
          error: "user_id, title and body are required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Supabase credentials
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Supabase credentials are not configured");
    }

    // Server-side Supabase client
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // Get all web tokens belonging to this user
    const { data: tokens, error: tokensError } = await supabase
      .from("push_tokens")
      .select("token")
      .eq("user_id", user_id)
      .eq("platform", "web");

    if (tokensError) {
      throw new Error(
        `Failed to fetch push tokens: ${tokensError.message}`
      );
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No push tokens found for this user",
          sent: 0,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Firebase credentials
    const projectId = Deno.env.get("FIREBASE_PROJECT_ID");
    const clientEmail = Deno.env.get("FIREBASE_CLIENT_EMAIL");
    const privateKeyBase64 = Deno.env.get("FIREBASE_PRIVATE_KEY_BASE64");

    if (!projectId || !clientEmail || !privateKeyBase64) {
      throw new Error("Firebase credentials are not configured");
    }

    const privateKey = atob(privateKeyBase64);

    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const accessToken = await jwtClient.getAccessToken();

    if (!accessToken.token) {
      throw new Error("Failed to get Firebase access token");
    }

    const results = [];

    // Send notification to every device of this user
    for (const item of tokens) {
      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token: item.token,
              notification: {
                title,
                body,
              },
              data,
            },
          }),
        }
      );

      const responseText = await response.text();

      results.push({
        success: response.ok,
        status: response.status,
        result: responseText,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: results.filter((item) => item.success).length,
        total: results.length,
        results,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("send-push-notification error:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error
          ? error.message
          : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
