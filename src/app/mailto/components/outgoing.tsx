import React from 'react';

export default function Outgoing({
  hash,
  isShareable,
  setIsShareable,
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
      <h3>Sharable Link Generator</h3>

      {/* Toggle */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <label style={{ marginRight: '.5rem', width: '58%' }}>
          Use this to select the catagories of representative that will be sent
          to audience members and autofilled based on their address.
        </label>

        <div>
          <button
            className="m_button"
            id="shareable"
            onClick={() => setIsShareable(!isShareable)}
          >
            {isShareable ? '🗣️ Shareable' : '⛔ Not Shareable'}
          </button>
        </div>
      </div>

      {isShareable && (
        <>
          {/* Assembly/Senate selector */}
          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ marginTop: '.5rem' }}>
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

            <div style={{ marginTop: 'rem', justifyContent: 'space-between' }}>
              {legislativeTargets?.length > 0 ? (
                <button className="m_button" onClick={(e) => copyLink(e)}>
                  Copy Shareable Link
                </button>
              ) : (
                <label>Select Assembly or Senate</label>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="main_label">Heading</label>
            <textarea
              id="header_field"
              value={decodeURIComponent(actionable.header)}
              rows={1}
              onChange={(e) => {
                setActionable({
                  header: e.target.value,
                  body: actionable.body,
                });
              }}
            />

            <label className="main_label">Body</label>
            <textarea
              id="header_field"
              value={decodeURIComponent(actionable.body)}
              rows={10}
              onChange={(e) => {
                setActionable({
                  header: actionable.header,
                  body: e.target.value,
                });
              }}
            />

            {/* Phone CTA toggle */}
            <div>
              <button
                className="l_button"
                onClick={(e) => setIsPhone(!isPhone)}
              >
                {isPhone ? '☎️ Phone CTA' : ' Not Phone CTA'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
