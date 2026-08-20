import { ToggleGroup } from 'radix-ui';
import { Switch } from 'radix-ui';
import { Icon } from '@iconify/react';
import Tooltip from './Tooltip';

const legislativeTargetOptions = [
  {
    id: 'assembly',
    name: 'Assembly',
  },
  {
    id: 'senate',
    name: 'Senate',
  },
];

export default function LandingPageSettings({
  hash,
  legislativeTargets,
  setLegislativeTargets,
  actionable,
  setActionable,
  isPhone,
  setIsPhone,
}) {
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
      <h2 className="font-title text-2xl font-bold">Landing Page</h2>

      <div
        className={
          'grid grid-cols-[max-content_1fr_min-content] items-center gap-x-8' +
          (legislativeTargets.length ? ' gap-y-6' : '')
        }
      >
        {/* Geotarget selector */}
        <span className="flex items-center gap-1.5">
          <Icon icon="material-symbols:distance-outline" />
          Geotarget
        </span>

        <div className="flex items-center gap-8">
          {legislativeTargetOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-4">
              <label id={`${option.id}-label`} htmlFor={option.id}>
                {option.name}
              </label>
              <Switch.Root
                className="relative h-6.5 w-10.75 cursor-default rounded-full bg-white p-0 outline-none data-[state=checked]:bg-black"
                id={option.id}
                checked={legislativeTargets.includes(option.name)}
                onCheckedChange={() => {
                  if (legislativeTargets.includes(option.name)) {
                    setLegislativeTargets(
                      legislativeTargets.filter(
                        (target) => target !== option.name,
                      ),
                    );
                  } else {
                    setLegislativeTargets([...legislativeTargets, option.name]);
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
          as recipients based on the user&apos;s geographic location.
        </Tooltip>

        {/* Phone CTA toggle - only show if geotarget is activated */}
        <span
          className={
            'flex items-center gap-1.5' +
            // Prevent layout shift
            (!legislativeTargets.length ? ' invisible max-h-0' : '')
          }
        >
          <Icon icon="material-symbols:call-outline" />
          Phone CTA
        </span>

        <ToggleGroup.Root
          className={
            'togglegroup-root justify-self-start' +
            // Prevent layout shift
            (!legislativeTargets.length ? ' invisible max-h-0' : '')
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

        <Tooltip>Include the legislators&apos; phone number.</Tooltip>
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
          value={decodeURIComponent(actionable?.header)}
          onChange={(e) => {
            setActionable({
              header: e.target.value,
              body: actionable.body,
            });
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
            You can use the variables&nbsp;
            <span className="font-mono">
              [[district]] [[legislator]] [[role]]
            </span>
            &nbsp; in conjunction with the&nbsp;
            <span className="font-bold">Geotarget</span>&nbsp;setting above to
            include informationa about the recipients&apos; representatives
            dynamically.
          </Tooltip>
        </label>
        <textarea
          id="landing-page-body"
          value={decodeURIComponent(actionable?.body)}
          rows={12}
          className="min-h-80"
          onChange={(e) => {
            setActionable({
              header: actionable.header,
              body: e.target.value,
            });
          }}
        />
      </div>

      {/* Shareable link */}
      <div>
        {hash ? (
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
