import React from 'react';
import { PlayerCard } from './PlayerCard';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'DarkOrbit/PlayerCard',
  component: PlayerCard,
  tags: ['autodocs'],
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Speed : Story = {
  args: {
    playerName: "Speed",
    playerImage: "assets/beginner.jfif",
    registeredAt: new Date(),
    timePlayedSeconds: 15 * 60 * 60,
    rank: "Space pilot jr.",
    rankedPosition: 7414,
}};

export const Thomas : Story = {
  args: {
    playerName: "Thomas",
    playerImage: "assets/chief.jpg",
    registeredAt: new Date(),
    timePlayedSeconds: 365 * 60 * 60,
    rank: "DarkOrbit god",
    rankedPosition: 1,
}};
