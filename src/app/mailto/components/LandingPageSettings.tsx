import { ToggleGroup } from 'radix-ui';
import { Icon } from '@iconify/react';

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
    const url =
      location.href.replace(location.hash, '') + '/out/*|EMAIL|*' + hash;
    navigator.clipboard.writeText(url);

    // Update UI
    event.target.innerText = 'Copied Link!';

    return;
  }

  return (
    <div className="flex flex-col gap-6 border-2 border-black bg-white p-8">
      <h2 className="font-title text-2xl font-bold">Landing Page</h2>

      <div className="grid grid-cols-[max-content_max-content] items-center gap-x-8 gap-y-6">
        {/* Geotarget selector */}
        <span
          title="Use this if you'd like to include an address lookup that will
            dyanmically add state legislators as recipients based on the user's
            geographic location."
          className="flex items-center gap-1.5"
        >
          <Icon icon="material-symbols:distance-outline" />
          Geotarget
        </span>

        <ToggleGroup.Root
          className="togglegroup-root"
          type="single"
          value={legislativeTargets.length ? legislativeTargets[0] : 'None'}
          onValueChange={(value) => {
            if (value === 'None') {
              setLegislativeTargets([]);
            } else {
              setLegislativeTargets([value]);
            }
          }}
          aria-label="Text alignment"
        >
          <ToggleGroup.Item className="togglegroup-item" value="None">
            None
          </ToggleGroup.Item>
          <ToggleGroup.Item className="togglegroup-item" value="Assembly">
            Assembly
          </ToggleGroup.Item>
          <ToggleGroup.Item className="togglegroup-item" value="Senate">
            Senate
          </ToggleGroup.Item>
        </ToggleGroup.Root>

        {/* Phone CTA toggle - only show if geotarget is activated */}
        {legislativeTargets.length ? (
          <>
            <span className="flex items-center gap-1.5">
              <Icon icon="material-symbols:call-outline" />
              Phone CTA
            </span>

            <ToggleGroup.Root
              className="togglegroup-root justify-self-start"
              type="single"
              value={isPhone ? 'true' : 'false'}
              onValueChange={(value) => setIsPhone(value === 'true')}
              aria-label="Text alignment"
            >
              <ToggleGroup.Item className="togglegroup-item" value="true">
                Yes
              </ToggleGroup.Item>
              <ToggleGroup.Item className="togglegroup-item" value="false">
                No
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </>
        ) : (
          ''
        )}
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
          value={decodeURIComponent(actionable.header)}
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
        <label htmlFor="landing-page-body">Body</label>
        <textarea
          id="landing-page-body"
          value={decodeURIComponent(actionable.body)}
          rows={10}
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
