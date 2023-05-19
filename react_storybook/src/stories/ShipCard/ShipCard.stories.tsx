import React from 'react';
import { ShipCard } from './ShipCard';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'DarkOrbit/ShipCard',
  component: ShipCard,
  tags: ['autodocs'],
} satisfies Meta<typeof ShipCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Daedalus: Story = {
  args: {
    shipName: "USS Daedalus",
    shipImage: "assets/daedalus.jfif",
  },
};

export const Aurora: Story = {
  args: {
    shipName: "Aurora",
    shipImage: "assets/aurora.jpg",
  },
};