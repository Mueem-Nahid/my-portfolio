import { Link2, Mail } from "lucide-react";
import { Text } from "@/components/atoms/Text";
import { SocialIconLink } from "@/components/molecules/SocialIconLink";
import type { Profile } from "@/lib/content";

type FooterProps = {
  profile: Profile;
};

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8">
        <Text as="span" mono tone="muted" className="text-xs">
          © {new Date().getFullYear()} {profile.name}
        </Text>
        <div className="flex items-center gap-2">
          <SocialIconLink
            icon={Mail}
            href={`mailto:${profile.email}`}
            label="Email"
          />
          <SocialIconLink
            icon={Link2}
            href={profile.socials.github}
            label="GitHub profile"
          />
          <SocialIconLink
            icon={Link2}
            href={profile.socials.linkedin}
            label="LinkedIn profile"
          />
        </div>
        <a
          href="#top"
          className="font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
