import { Link2, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { ContactRow } from "@/components/molecules/ContactRow";
import type { Profile } from "@/lib/content";

type ContactSectionProps = {
  profile: Profile;
};

/** Direct contact only (§4): email + socials, no form backend (§10). */
export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <Text tone="muted" className="max-w-prose">
          Building something that needs billing, search, or real-time tracking
          done properly? Email me directly — I read everything.
        </Text>
        <div className="mt-6">
          <Button href={`mailto:${profile.email}`}>
            <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
            {profile.email}
          </Button>
        </div>
      </div>
      <div className="space-y-3 lg:justify-self-end">
        <ContactRow
          icon={Mail}
          label="email"
          value={profile.email}
          href={`mailto:${profile.email}`}
        />
        <ContactRow
          icon={Link2}
          label="github"
          value="github.com/Mueem-Nahid"
          href={profile.socials.github}
        />
        <ContactRow
          icon={Link2}
          label="linkedin"
          value="linkedin.com/in/mueem-nahid"
          href={profile.socials.linkedin}
        />
        <div className="flex items-center gap-3 pt-1">
          <MapPin
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className="shrink-0 text-muted"
          />
          <Text as="span" tone="muted" size="sm">
            {profile.location}
          </Text>
        </div>
      </div>
    </div>
  );
}
