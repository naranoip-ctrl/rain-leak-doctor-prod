'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { trackCallClick } from '@/lib/analytics';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'onClick'> & { phone: string; location: string };

export function TrackedCallLink({ phone, location, children, ...props }: Props) {
  return <a {...props} href={`tel:${phone}`} onClick={() => trackCallClick(location)}>{children}</a>;
}
