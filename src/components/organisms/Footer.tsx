import { Mail } from "lucide-react";
import { BrandIcon } from "@/components/atoms/BrandIcon";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { ScrollToTopLink } from "@/components/molecules/ScrollToTopLink";
import { SocialIconLink } from "@/components/molecules/SocialIconLink";
import type { Profile } from "@/lib/content";
import { getLastUpdated } from "@/lib/site";

type FooterProps = {
  profile: Profile;
};

export function Footer({ profile }: FooterProps) {
  const updated = getLastUpdated();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 sm:px-6">
        <Text as="span" mono tone="muted" className="text-xs">
          © {new Date().getFullYear()} {profile.name}
          {updated ? ` · Updated ${updated}` : ""}
        </Text>
        <div className="flex items-center gap-2">
          <SocialIconLink
            icon={<Icon icon={Mail} size={18} />}
            href={`mailto:${profile.email}`}
            label="Email"
          />
          <SocialIconLink
            icon={<BrandIcon brand="github" size={18} />}
            href={profile.socials.github}
            label="GitHub profile"
          />
          <SocialIconLink
            icon={<BrandIcon brand="linkedin" size={18} />}
            href={profile.socials.linkedin}
            label="LinkedIn profile"
          />
          {profile.socials.facebook ? (
            <SocialIconLink
              icon={<BrandIcon brand="facebook" size={18} />}
              href={profile.socials.facebook}
              label="Facebook profile"
            />
          ) : null}
        </div>
        <ScrollToTopLink className="font-mono text-xs text-muted transition-colors hover:text-ink">
          Back to top
        </ScrollToTopLink>
      </div>
    </footer>
  );
}
