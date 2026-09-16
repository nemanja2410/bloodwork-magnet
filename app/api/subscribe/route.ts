import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Inicijalizujemo Supabase i Resend sa tvojim ključevima iz .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, email } = await request.json();

    if (!firstName || !email) {
      return NextResponse.json(
        { error: "First name and email are required." },
        { status: 400 }
      );
    }

    // 1. Upisujemo korisnika u Supabase tabelu
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert([{ first_name: firstName, email: email }]);

    if (dbError) {
      // Ako je email već prijavljen, možemo to elegantno da preskočimo ili vratimo grešku
      if (dbError.code === "23505") {
        return NextResponse.json(
          { message: "You are already subscribed!" },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    // 2. Šaljemo mejl preko Resend-a sa linkom ka vodiču
    // (Napomena: Za početak, Resend zahteva da šalješ sa onboarding@resend.dev dok ne verifikuješ svoj domen)
    await resend.emails.send({
      from: "Blood Work Guide <onboarding@resend.dev>",
      to: [email],
      subject: "Your Complete Blood Work Guide is here 🩸",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
          <h2 style="font-weight: 800;">Hey ${firstName},</h2>
          <p>Thanks for requesting the <strong>Complete Blood Work Guide</strong>.</p>
          <p>You can download your guide directly using the button below:</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/The_Complete_Blood_Work_Guide_Exact.pdf" 
             style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
            DOWNLOAD YOUR GUIDE
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">Keep this guide handy when discussing your results with your healthcare professional.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}