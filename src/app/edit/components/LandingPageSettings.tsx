import { type Dispatch, type SetStateAction } from 'react';
import { ToggleGroup } from 'radix-ui';
import { Switch } from 'radix-ui';
import { Icon } from '@iconify/react';
import Tooltip from './Tooltip';

const geotargetOptions = [
  {
    id: 'assembly',
    name: 'Assembly',
  },
  {
    id: 'senate',
    name: 'Senate',
  },
] as const;

// Use as type
export type GeotargetOptions = (typeof geotargetOptions)[number]['name'];

interface LandingPageSettingsProps {
  slug: string;
  geotargetDistrictTypes: Array<GeotargetOptions>;
  setGeotargetDistrictTypes: Dispatch<SetStateAction<Array<GeotargetOptions>>>;
  isPhone: boolean;
  setIsPhone: Dispatch<SetStateAction<boolean>>;
  heading: string;
  setHeading: Dispatch<SetStateAction<string>>;
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
}

export default function LandingPageSettings({
  slug,
  geotargetDistrictTypes,
  setGeotargetDistrictTypes,
  isPhone,
  setIsPhone,
  heading,
  setHeading,
  body,
  setBody,
}: LandingPageSettingsProps) {
  /**
   * Copy link to clipboard
   * @param event - Mouse event
   */
  async function copyLink(event) {
    // Generate URL and copy to clipboard
    const url = `${location.href.replace('edit', 'act')}?email=*|EMAIL|*`;
    navigator.clipboard.writeText(url);

    // Update UI
    event.target.innerText = 'Copied Link!';

    return;
  }

  return (
    <div className="flex flex-col gap-6 border-2 border-black bg-white p-8">
      <h2 className="font-title flex items-center gap-1.5 text-2xl font-bold">
        Landing Page
        <Tooltip>
          Settings for a landing page that can be shared with advocates and
          contains information about the CTA and a button to automatically open
          the the email template in their mail client
        </Tooltip>
      </h2>

      <div
        className={
          'grid grid-cols-[max-content_1fr_min-content] items-center gap-x-8' +
          (geotargetDistrictTypes.length ? ' gap-y-6' : '')
        }
      >
        {/* Geotarget selector */}
        <span className="flex items-center gap-1.5">
          <Icon icon="material-symbols:distance-outline" />
          Geotarget
        </span>

        <div className="flex items-center gap-8">
          {geotargetOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-4">
              <label id={`${option.id}-label`} htmlFor={option.id}>
                {option.name}
              </label>
              <Switch.Root
                className="relative h-6.5 w-10.75 cursor-default rounded-full bg-white p-0 outline-none data-[state=checked]:bg-black"
                id={option.id}
                checked={geotargetDistrictTypes.includes(option.name)}
                onCheckedChange={() => {
                  if (geotargetDistrictTypes.includes(option.name)) {
                    setGeotargetDistrictTypes(
                      geotargetDistrictTypes.filter(
                        (target) => target !== option.name,
                      ),
                    );
                  } else {
                    setGeotargetDistrictTypes([
                      ...geotargetDistrictTypes,
                      option.name,
                    ]);
                  }
                }}
              >
                <Switch.Thumb
                  id={option.id}
                  aria-labelledby={`${option.id}-label`}
                  className="block size-5.25 translate-x-0.5 rounded-full border-2 border-black bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4.25"
                />
              </Switch.Root>
            </div>
          ))}
        </div>

        <Tooltip>
          Include an address lookup that will dyanmically add state legislators
          as recipients based on the advocate&apos;s geographic location.
        </Tooltip>

        {/* Phone CTA toggle - only show if geotarget is activated */}
        <span
          className={
            'flex items-center gap-1.5' +
            // Prevent layout shift
            (!geotargetDistrictTypes.length ? ' invisible max-h-0' : '')
          }
        >
          <Icon icon="material-symbols:call-outline" />
          Phone CTA
        </span>

        <ToggleGroup.Root
          className={
            'togglegroup-root justify-self-start' +
            // Prevent layout shift
            (!geotargetDistrictTypes.length ? ' invisible max-h-0' : '')
          }
          type="single"
          value={isPhone ? 'true' : 'false'}
          onValueChange={(value) => setIsPhone(value === 'true')}
          aria-label="Include CTA to call legislator(s)"
        >
          <ToggleGroup.Item className="togglegroup-item" value="true">
            Yes
          </ToggleGroup.Item>
          <ToggleGroup.Item className="togglegroup-item" value="false">
            No
          </ToggleGroup.Item>
        </ToggleGroup.Root>

        <Tooltip
          className={!geotargetDistrictTypes.length ? 'invisible max-h-0' : ''}
        >
          Include the legislators&apos; phone number.
        </Tooltip>
      </div>

      {/* Heading field */}
      <div className="flex flex-col">
        <label
          htmlFor="landing-page-heading"
          className="flex items-center gap-1.5"
        >
          Heading
          <span aria-label="Required" title="Required" className="text-red-500">
            *
          </span>
        </label>
        <input
          id="landing-page-heading"
          value={decodeURIComponent(heading)}
          onChange={(e) => {
            setHeading(e.target.value);
          }}
          required
        />
      </div>

      {/* Body field*/}
      <div className="flex flex-col">
        <label
          htmlFor="landing-page-body"
          className="flex items-center justify-between gap-1.5"
        >
          Body
          <Tooltip>
            If the&nbsp;<span className="font-bold">Geotarget</span>
            &nbsp;setting above is enabled, you can use the variables&nbsp;
            <span className="font-mono">[[district]]</span>,&nbsp;
            <span className="font-mono">[[legislator]]</span>, and&nbsp;
            <span className="font-mono">[[role]]</span>
            &nbsp;to dynamically include information about the advocate&apos;s
            representatives.
          </Tooltip>
        </label>
        <textarea
          id="landing-page-body"
          value={decodeURIComponent(body)}
          rows={12}
          className="min-h-80"
          onChange={(e) => {
            setBody(e.target.value);
          }}
        />
      </div>

      {/* Shareable link */}
      <div>
        {slug ? (
          <button
            className="flex w-full items-center justify-center gap-1.5 border-2 border-black font-mono"
            onClick={(e) => copyLink(e)}
          >
            <Icon icon="material-symbols:link-2" />
            Copy landing page URL
          </button>
        ) : (
          <span className="text-gray-400 italic">
            Save to generate a shareable link
          </span>
        )}
      </div>
    </div>
  );
}
