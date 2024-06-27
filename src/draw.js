import React, { useEffect, useRef } from 'react';
import {select,hierarchy,tree, linkVertical} from 'd3';


const Draw = ({data,width,height}) => {
    const svgref=useRef();
    const wrapper=useRef();
    

    useEffect(()=>{
        const svg=select(svgref.current);

        const root=hierarchy(data);
        const layout=tree().size([width-10,.8*height]);
        layout(root);

        const edge=linkVertical() .x(node=>node.x) .y(node=>node.y+30);

        svg .selectAll('.node') .data(root.descendants())
            .join('circle') .attr('class','node')
            .attr('r',4)    .attr('fill','black')
            .attr('cx',node=> node.x) .attr('cy',node=>node.y+30)

        svg .selectAll('.link') .data(root.links())
            .join('path') .attr('fill','none')
            .attr('stroke','black')
            .attr('d',edge);

        svg .selectAll('.label') .data(root.descendants())
            .join('text') .attr('class','label')
            .text(node=>node.data.id)
            .attr('text-anchor','middle')
            .attr('font-size',15)
            .attr('x',node=>node.x-12) .attr('y',node=>node.y+37);

        console.log(root);

        return () => {
            svg.selectAll('*').remove();
        };
        
    },[data,width,height])


    return(
        <div ref={wrapper}  width={width-20+'px'} height={height-20+'px'}>
            <svg ref={svgref} width={width-20+'px'} height={height-20+'px'} style={{marginTop:"8px"}}></svg>
        </div>
    )

  };
  
  export default Draw;
  