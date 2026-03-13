import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createInvitation } from "@/features/members/actions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, workspaceId, invitedBy, workspaceName } =
      await request.json();

    const inviteResult = await createInvitation(email, workspaceId, invitedBy);

    if (!inviteResult.success) {
      return NextResponse.json(
        { error: "Failed to create invitation" },
        { status: 500 },
      );
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${inviteResult.token}`;

    const { error } = await resend.emails.send({
      from: "Taskify <onboarding@resend.dev>",
      to: [email],
      subject: `You are invited to join the ${workspaceName} Workspace!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #111;">Hello!</h1>
          <p>You have been invited to join the workspace <strong>${workspaceName}</strong>.</p>
          <p>Click the button below to accept the invitation:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #2563EB; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Accept Invitation
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">
            This invitation link will expire in 48 hours.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: "Invitation sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
