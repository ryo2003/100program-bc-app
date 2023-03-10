import React from "react";

function Header(props) {
  return (
    <div>
      <header>
        <h1>Fund Me</h1>
        {!props.currentAccount && (
          <button className="waveButton" onClick={props.connectWallet}>
            Connect Wallet
          </button>
        )}
        {props.currentAccount && (
          <button className="waveButton" onClick={props.connectWallet}>
            Wallet Connected
          </button>
        )}
      </header>
    </div>
  );
}

export default Header;
