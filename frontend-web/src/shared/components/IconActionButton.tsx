import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconActionTone = 'default' | 'primary' | 'info' | 'success' | 'error';
type IconActionSize = 'xs' | 'sm';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface IconActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode;
  label: string;
  tone?: IconActionTone;
  size?: IconActionSize;
  tooltipPosition?: TooltipPosition;
}

const toneClassByVariant: Record<IconActionTone, string> = {
  default: 'text-base-content/80 hover:text-base-content hover:bg-base-200',
  primary: 'text-primary hover:bg-primary/10',
  info: 'text-info hover:bg-info/10',
  success: 'text-success hover:bg-success/10',
  error: 'text-error hover:bg-error/10',
};

const sizeClassByVariant: Record<IconActionSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
};

export function IconActionButton({
  icon,
  label,
  tone = 'default',
  size = 'xs',
  tooltipPosition = 'top',
  type = 'button',
  className,
  ...props
}: IconActionButtonProps) {
  const classNames = [
    'btn',
    'btn-ghost',
    'btn-square',
    'no-animation',
    sizeClassByVariant[size],
    toneClassByVariant[tone],
    className ?? '',
  ]
    .join(' ')
    .trim();

  return (
    <div className={`tooltip tooltip-${tooltipPosition}`} data-tip={label}>
      <button type={type} aria-label={label} title={label} className={classNames} {...props}>
        {icon}
      </button>
    </div>
  );
}
