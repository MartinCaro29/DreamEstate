import React, { useState, useEffect } from 'react';

import '../../index.css';
import './Header.css';

function Header(props) {
 

    return (
        <div style={{display:'flex', justifyContent:'left'}}>
          <div className="arrow-header" >{props.name}</div>  
        </div>
        
    );
}

export default Header;