import { ActionIcon, Indicator, MantineColor, Tooltip } from '@mantine/core';
import { Icon } from '@tabler/icons-react';
import { ReactNode } from 'react';

export interface NavigationButtonProperties {
  label: string;
  icon: Icon;
  active?: boolean;
  indicator?: MantineColor;
  onClick: () => void;
}

const withTooltip = (component: ReactNode, label: string | null) => {
  if (label == null) {
    return component;
  }

  return (
    <Tooltip label={label} position='right'>
      {component}
    </Tooltip>
  );
};

const withIndicator = (component: ReactNode, color: MantineColor | null) => {
  if (color == null) {
    return component;
  }

  return (
    <Indicator color={color} position='top-end' radius='xl'>
      {component}
    </Indicator>
  );
};

export function NavigationButton(props: NavigationButtonProperties) {
  return withTooltip(
    withIndicator(
      <ActionIcon size='lg' color='dark' variant={props.active ? 'default' : 'filled'} onClick={props.onClick}>
        <props.icon size='1rem' />
      </ActionIcon>,
      props.indicator ?? null
    ),
    props.active ? null : props.label
  );
}
