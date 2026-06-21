import React from 'react';

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
   * Update list by toggling specified legslative body
   * @param target - `Assembly` or `Senate`
   */
  function updateLegislativeTargets(target) {
    let updatedTargets;

    if (legislativeTargets.includes(target)) {
      // Remove
      updatedTargets = legislativeTargets.toSpliced(
        legislativeTargets.indexOf(target),
        1,
      );
    } else {
      // Add
      updatedTargets = [...legislativeTargets, target];
    }

    setLegislativeTargets(updatedTargets);

    return;
  }

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
    <div className="bg-bg m-2 rounded-2xl p-4">
      <header className="flex w-full justify-between">
        <h3 className="font-bold mb-4 text-lg">Landing Page Settings</h3>

        {/* Shareable link */}
        <div>
          {hash ? (
            <button
              className="m-1 rounded px-2 py-1 hover:underline"
              onClick={(e) => copyLink(e)}
            >
              Copy Shareable Link
            </button>
          ) : (
            <label>Save to generate a shareable link</label>
          )}
        </div>
      </header>

      {/* Content */}
      <section className="flex flex-col gap-2">
        {/* Heading */}
        <div className="flex flex-col">
          <label htmlFor="landing-page-heading" className="mt-4">
            Heading (required)
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

        {/* Assembly/Senate selector */}
        <div>
          <label className="mb-2 block">
            Use this if you'd like to include an address lookup that will
            dyanmically add state legislators as recipients based on the user's
            geographic location.
          </label>
          <div className="flex w-full items-center">
            {/* Legislative category */}
            <div className="flex grow">
              <button
                className={
                  'm-1 rounded px-2 py-1 hover:underline' +
                  (legislativeTargets.includes('Assembly')
                    ? ' !bg-soft-bg before:text-xs before:content-["✔️"]'
                    : '')
                }
                onClick={() => {
                  updateLegislativeTargets('Assembly');
                }}
              >
                Assembly
              </button>
              <button
                className={
                  'm-1 rounded px-2 py-1 hover:underline' +
                  (legislativeTargets.includes('Senate')
                    ? ' !bg-soft-bg before:text-xs before:content-["✔️"]'
                    : '')
                }
                onClick={() => {
                  updateLegislativeTargets('Senate');
                }}
              >
                Senate
              </button>
            </div>

            {/* Phone CTA toggle - only show if legislative target is activated */}
            {legislativeTargets.length ? (
              <div>
                <button
                  className="!bg-copy hover:!bg-copyhigh !border-copyhigh rounded-lg !border px-2 py-1"
                  onClick={(e) => setIsPhone(!isPhone)}
                >
                  {isPhone ? '☎️ Phone CTA' : ' Not Phone CTA'}
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col">
          <label htmlFor="landing-page-body" className="mt-4">
            Body
          </label>
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
      </section>
    </div>
  );
}
