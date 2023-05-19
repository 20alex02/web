import React, { useState } from "react";
import "./auction.css";
import "./auctionItem.css";

interface Props {
  items: {
    itemName: string;
    itemImage: string;
    topBidderName: string;
    topBid: number;
    yourBid: number;
    instantBuy: number;
    sold: boolean;
    itemType: string;
  }[];
}

export function Auction({ items }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <div className="auction">
      <table className="auction__item-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Type</th>
            <th>Top bidder</th>
            <th>Top bid</th>
            <th>Your bid</th>
            <th>Instant buy</th>
          </tr>
        </thead>
        <tbody className="auction__items auction__items-wrapper">
          {items.map((item) => (
            <tr className={"auction-item auction-item--blue-color " + (item.sold ? 'auction-item--sold' : 'auction-item--active')}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            key={item.itemName}>
              <td className="auction-item__item-description">
                <img
                  src={item.itemImage}
                  alt="Item"
                  className="item-description__image"
                />
                <p className="auction-item__text-info">{item.itemName}</p>
              </td>
              <td className="auction-item__text-info">{item.itemType}</td>
              <td className="auction-item__text-info">{item.topBidderName}</td>
              <td className="auction-item__text-info">{item.topBid}</td>
              <td className="auction-item__text-info">{item.yourBid}</td>
              <td className="auction-item__text-info">{item.instantBuy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Auction;
