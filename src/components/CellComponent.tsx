import React from "react";
import { Cell } from "../models/Cell";
import { FC } from "react";

interface CellProps{
    cell: Cell;
    selected: boolean;
    click: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> =({cell, selected, click}) =>{
    return(
        <div 
        className={[
        'cell', 
        cell.color, 
        selected ? "selected" : '',
        cell.underAttack ? "under-attack" : ''
         ].join(' ')}
       // className={['cell', cell.color, selected ? "selected" : ''].join(' ')}
        onClick={() => click(cell)}
        style={{background: cell.available && cell.figure ? "green" : '', boxShadow: cell.underAttack ? '0 0 10px 5px red' : ''}}>
            {cell.available && !cell.figure && <div className="available"></div>}
            {cell.figure?.logo && <img src={cell.figure.logo}  alt=""/>}
            
        </div>
    )
}

export default CellComponent;