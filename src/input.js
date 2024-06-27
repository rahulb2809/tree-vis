import React, { useState, useEffect } from 'react';
import Draw from './draw';
import './input.css'; 

const Input = () => {
  const [value, setValue] = useState('');
  const [valid,setValid] = useState(-1);
  const [data,setData] = useState({});
  const ref = React.useRef(null);

  const adjust=()=>{
    const area = ref.current;
    area.style.height = 'auto'; 
    area.style.height = area.scrollHeight+'px'; 
  };


  const boxh = (e)=>{
    setValue(e.target.value); adjust();
  };


  useEffect(() => {adjust();}, [value]);
//  useEffect(()=>{setData(t);console.log(t);},[]);

  
  const linenos= ()=> {
    const lines = value.split('\n');
    const knt = lines.length;
    let arr=Array(knt).keys();
    return Array.from(arr).map((no)=>
    (
      <div key={no+1} style={{fontSize:'16px'}}>{no+1}</div>
    ));
  };

  let vis=Array(101).fill(0);
  let p=Array(101).fill(-1);

  function dfs(g,u,par){
    vis[u]=1; p[u]=par;
    for(let v of g[u]){
      
      if(v!=par && vis[v]==0) dfs(g,v,u);
    }
  }

  

  function adjtotree(g, root,p) {
    
    function build(node) {
      let nxt= g[node].filter(x => x!=p[node]);
      if (!nxt || nxt.length== 0) return {id:node};

      let children = nxt.map(x=>build(x));
      return {id:node,children};
    }
    let tree={id:root};
    tree=build(root);
    return tree;
  }
  


  const click= ()=>{
    const e=value.split('\n');
    //console.log(e);
    let set=new Set();
    for(let i=0;i<e.length;i++){
      let x=e[i].split(' ');
      let y=x[1]+' '+x[0];

      if(e[i] && set.has(y)==false)
      set.add(e[i]);
    }
    // console.log(set);
    let n=1+set.size;
    // console.log(n);

    let nodes=new Set();

    let adj=new Array(n+1);
    for(let i=0;i<n+1;i++) adj[i]=[];

    for(let s of set){
      //console.log(s);
      let x=s.split(' ');
      nodes.add(parseInt(x[0]));
      nodes.add(parseInt(x[1]));
    }
    // console.log(nodes);

    if(nodes.size !=n){setValid(0);return;}
    
    for(let i=1;i<n+1;i++){
      if(nodes.has(i)==false){setValid(0);return;}
    }
    for(let s of set){
      let x=s.split(' ');
      adj[parseInt(x[0])].push(parseInt(x[1]));
      adj[parseInt(x[1])].push(parseInt(x[0]));
    }
    //console.log(adj);

    for(let i=0;i<101;i++) {vis[i]=0;p[i]=-1;}
    dfs(adj,1,0);

    for(let i=1;i<n+1;i++){
      if(vis[i]==0){setValid(0);return;}
    }

    setValid(1); 
    let t=adjtotree(adj,1,p);
    setData(t);
    //console.log(t);
    //console.log(data);
  }


  const [w,setW]=useState(0);
  const [h,setH]=useState(0);

  useEffect(() => {
    const handleresize=()=>{
      setW(document.getElementById("tree-container").offsetWidth);
      setH(document.getElementById("tree-container").offsetHeight);
      // console.log('new',w);
    };
    window.addEventListener('resize',handleresize,true);
    
    handleresize();
    
    return window.removeEventListener('resize',handleresize);
  },[]
  );
  
  

  return (
    <div className='overall'>
      <div className='all'>
        <div className='button-container'>
          <button className='button' onClick={click}>Visualise</button>
          
        </div>
        
        <div className="text-box-container">
          <div className="line-numbers"> {linenos()} </div>
          
          <textarea ref={ref} className="text-box"
            value={value}  onChange={boxh}
            placeholder={'Enter data here'}
          />
        </div>

        {valid==0 && <div className='invalid'>INVALID!!</div>}
      </div>

      <div id="tree-container">
        {valid==1 && <Draw data={data} width={w} height={h}/>}
        
      </div>

      </div>
  );
};

export default Input;
