import React from 'react';
import { Item } from './Item';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'DarkOrbit/Item',
  component: Item,
  tags: ['autodocs'],
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Victory: Story =
{
  args : {
    itemName: "Victory",
    itemClassification: "Star destroyer",
    itemPrice: 64000000,
    itemDescription: "Make more of these bruh...",
    itemImage: "assets/victory.jpg"
  }
};

export const Prometheus: Story =
{
  args : {
    itemName: "Prometheus",
    itemClassification: "Tauri battlecruiser",
    itemPrice: 154000000,
    itemDescription: "Pretty pretty good...",
    itemImage: "assets/prometheus.jfif"
  }
};

export const Juggernaut: Story =
{
  args : {
    itemName: "Juggernaut",
    itemClassification: "Republic tank",
    itemPrice: 6400000,
    itemDescription: "Big boy...",
    itemImage: "assets/juggernaut.jpg"
  }
};
