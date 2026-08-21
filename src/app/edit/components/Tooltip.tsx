import { Tooltip } from 'radix-ui';
import { Icon } from '@iconify/react';

/**
 * A styled tooltip
 * @param props.children - Tooltip content
 * @returns
 */
export default function CustomTooltip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="rounded-full p-0.5 hover:bg-gray-200">
            <Icon icon="lucide:info" className="text-base" />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-md rounded bg-black px-3.5 py-2.25 text-sm text-white"
            sideOffset={5}
          >
            {children}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
