import React, { useState } from 'react';
import './item.css';

interface Props {
    itemName: string,
    itemClassification: string,
    itemPrice: number,
    itemDescription: string,
    itemImage: string,
}

export function Item({
    itemName: name,
    itemClassification: classification,
    itemPrice: price,
    itemDescription: description,
    itemImage: source
}: Props) {
    const [selected, setSelected] = useState(false);
    return (
        <div className="item" onClick={() => setSelected(!selected)}>
            <img src={source} alt="" className="background-image"/>
            <div className="item__preview">
                <div className="item__name">
                    <h2>{name}</h2>
                    <h3>{classification}</h3>
                </div>
                <p className="item__price">{price}</p>
            </div>
            <div className={"item__description " + (selected ? 'item__description--enabled' : 'item__description--disabled')}>
                <p className="item__description-text">{description}</p>
            </div>
        </div>
    )
}

export default Item;