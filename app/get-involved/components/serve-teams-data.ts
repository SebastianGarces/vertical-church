export type ServeTeamOption = {
  title: string;
  description: string;
  /** Optional team-specific notification email (set via env var reference) */
  notifyEmailEnvVar?: string;
};

/**
 * Get team-specific notification emails for the selected service interests.
 * Returns an array of emails (may be empty if no team emails are configured).
 * Each env var can contain comma-separated emails (e.g., "lead@example.com,assistant@example.com").
 */
export function getTeamNotifyEmails(serviceInterests: string[]): string[] {
  const emails: string[] = [];
  
  for (const team of SERVE_TEAM_OPTIONS) {
    if (!team.notifyEmailEnvVar || !serviceInterests.includes(team.title)) {
      continue;
    }
    
    const envValue = process.env[team.notifyEmailEnvVar]?.trim();
    if (envValue) {
      // Support comma-separated emails per team
      const teamEmails = envValue
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      emails.push(...teamEmails);
    }
  }
  
  return [...new Set(emails)]; // Dedupe in case same email for multiple teams
}

export const SERVE_TEAM_OPTIONS: ServeTeamOption[] = [
  {
    title: "Guest Services",
    description:
      "Welcome and assist guests, help with parking, and extend hospitality so every person feels at home.",
    notifyEmailEnvVar: "SERVE_NOTIFY_GUEST_SERVICES",
  },
  {
    title: "Worship Team",
    description:
      "Use your gifts in music, vocals, or production to help lead the church in worship.",
    notifyEmailEnvVar: "SERVE_NOTIFY_WORSHIP",
  },
  {
    title: "Kids Team",
    description:
      "Serve in children's ministry—teaching, caring for, and investing in the next generation.",
    notifyEmailEnvVar: "SERVE_NOTIFY_KIDS",
  },
  {
    title: "Student Team",
    description:
      "Invest in middle and high school students through teaching, mentoring, and community.",
    notifyEmailEnvVar: "SERVE_NOTIFY_STUDENTS",
  },
  {
    title: "Tech Team",
    description:
      "Run audio, video, lighting, and live stream so the message and worship are clear and engaging.",
    notifyEmailEnvVar: "SERVE_NOTIFY_TECH",
  },
  {
    title: "Creative Team",
    description:
      "Contribute through design, photography, social media, and other creative roles.",
    notifyEmailEnvVar: "SERVE_NOTIFY_CREATIVE",
  },
];

