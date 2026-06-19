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
    <div className="data_field">
      <header
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <h3>Landing Page Settings</h3>

        {/* Shareable link */}
        <div style={{ marginTop: 'rem', justifyContent: 'space-between' }}>
          {hash ? (
            <button className="m_button" onClick={(e) => copyLink(e)}>
              Copy Shareable Link
            </button>
          ) : (
            <label>Save to generate a shareable link</label>
          )}
        </div>
      </header>

      {/* Content */}
      <section
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        {/* Heading */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="header_field" className="main_label">
            Heading
          </label>
          <input
            id="header_field"
            value={decodeURIComponent(actionable.header)}
            onChange={(e) => {
              setActionable({
                header: e.target.value,
                body: actionable.body,
              });
            }}
          />
        </div>

        {/* Assembly/Senate selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Use this if you'd like to include an address lookup that will dyanmically add state legislators as recipients based on the user's geographic location.
          </label>
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <button
              className={
                'm_button' +
                (legislativeTargets.includes('Assembly') ? ' selected' : '')
              }
              onClick={() => {
                updateLegislativeTargets('Assembly');
              }}
            >
              Assembly
            </button>
            <button
              className={
                'm_button' +
                (legislativeTargets.includes('Senate') ? ' selected' : '')
              }
              onClick={() => {
                updateLegislativeTargets('Senate');
              }}
            >
              Senate
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="body_field" className="main_label">
            Body
          </label>
          <textarea
            id="body_field"
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

        {/* Phone CTA toggle */}
        <div>
          <button className="l_button" onClick={(e) => setIsPhone(!isPhone)}>
            {isPhone ? '☎️ Phone CTA' : ' Not Phone CTA'}
          </button>
        </div>
      </section>
    </div>
  );
}
