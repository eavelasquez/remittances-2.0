import React, { useState } from "react";
import RLogin, { RLoginButton } from "@rsksmart/rlogin";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const rLogin = new RLogin({
  cachedProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          31: "https://public-node.testnet.rsk.co",
        },
      },
    },
  },
  supportedChains: [31], // we are going to connect to rsk testnet for this test
});

const Form = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState("");
  const [signature, setSignature] = useState("");
  const [fiatAmountBtc, setFiatAmountBtc] = useState("");
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [totalAmountRemittance, setTotalAmountRemittance] = useState(0);

  const [form, setForm] = useState({
    SenderID: "80123456",
    SenderName: "Carolina Velásquez",
    SenderPhoneNumber: "+50367424088",
    ReceiverID: "",
    ReceiverName: "",
    ReceiverPhoneNumber: "",
    RemittanceFiatAmount: 0.0,
    RemittanceFiatCurrency: "USD",
    FeeUSD: 1.0,
    Status: true,
  });

  const connect = () => {
    return rLogin.connect().then(({ provider }) => {
      setProvider(provider);
      provider
        .request({ method: "eth_accounts" })
        .then(([account]) => setAccount(account));
    });
  };

  const getBalance = () => {
    if (!account) return;
    return provider
      .request({
        method: "eth_getBalance",
        params: [account],
      })
      .then(setBalance);
  };

    /* The POST method adds a new entry in the mongodb database. */
    const postData = async (form) => {
      try {
        console.log(form);
        console.log(txHash);
        console.log(signature);
        const res = await fetch("/api/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
          throw new Error(res.status);
        }
        const { data } = await res.json();
        setData(data);
        console.log(data);

        MySwal.fire({
          title: "¡Se creó exitosamente la remesa!",
          icon: "success",
          html: `
            <p><strong>PIN:</strong> ${data?.remittance?.PIN || ''}</p>
            <p><strong>Tu giro estará disponible en 2 minutos aproximadamente.</strong></p>
          `,
        });
        return data;
      } catch (error) {
        setMessage("Failed to add remittance");
        console.log(error);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Failed to add remittance.',
        });
      }
    };

  const personalSign = () => {
    const message = "Welcome to RIF Identity suite!!!";
    return provider
      .request({
        method: "personal_sign",
        params: [message, account],
      });
  };

  const toAddress = "0xEf4A35cD4D9c20591B330Cf9Ac1885E796Ed5661";
  const sendTransaction = () => {
    const totalAmount = Math.floor(
      Number(fiatAmountBtc) * 1000000000000000000,
    ).toString(16);
    console.log("fiatAmountBtc", fiatAmountBtc);
    console.log("totalAmount", totalAmount);
    return provider
      .request({
        method: "eth_sendTransaction",
        params: [{ from: account, to: toAddress, value: totalAmount }],
      })
      .then((tx) => {
        setTxHash(tx);
        return personalSign();
      })
      .then((sig) => {
        setSignature(sig);
        return postData(form);
      })
      .then((data) => (console.log(data)))
      .catch((error) => {
        console.log(error);
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Failed to send transaction.',
        });
      });
  };

  const handleChangeFiatAmount = (e) => {
    setForm({ ...form, RemittanceFiatAmount: e.target.value });

    fetch(
      "https://api.coingecko.com/api/v3/simple/price/?ids=rootstock&vs_currencies=usd",
    )
      .then((response) => response.json())
      .then(
        (data) => {
          console.log(data);
          const fiatAmount = e.target.value / data.rootstock.usd;
          const feeAmount = form.FeeUSD / data.rootstock.usd;
          setFiatAmountBtc(fiatAmount);
          setTotalAmountRemittance(fiatAmount + feeAmount);
        },
        (reason) => {
          console.log(reason);
        },
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url */
  const formValidate = () => {
    const errors = {};
    if (!form.ReceiverID) errors.ReceiverID = "DUI es requerido.";
    if (!form.ReceiverName) errors.ReceiverName = "Nombre completo es requerido";
    if (!form.RemittanceFiatAmount) errors.RemittanceFiatAmount = "Monto es requerido";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = formValidate();
    if (Object.keys(errors).length === 0) {
      sendTransaction();
    } else {
      console.log(errors);
      setErrors({ errors });
    }
  };

  return (
    <div className="row">
      <div className="col-sm-8 col-sm-offset-2">
        <div className="wizard-container">
          <div
            className="card wizard-card"
            data-color="orange"
            id="wizardProfile"
          >
            <form onSubmit={handleSubmit}>
              <div className="wizard-header">
                <h3 className="wizard-title">ENVIAR REMESA</h3>
                <h5>
                  A continuación, te solicitamos la información necesaria para
                  enviar tu remesa.
                </h5>
                <RLoginButton onClick={connect}>Conectar billetera</RLoginButton>
                <p><span className="badge badge-warning">Dirección billetera: {account}</span></p>
              </div>
              <div className="wizard-navigation">
                <ul>
                  <li>
                    <a href="#receiver" data-toggle="tab">
                      Destinatario
                    </a>
                  </li>
                  <li>
                    <a href="#remittance" data-toggle="tab">
                      Remesa
                    </a>
                  </li>
                  <li>
                    <a href="#resume" data-toggle="tab">
                      Resumen
                    </a>
                  </li>
                </ul>
              </div>

              <div className="tab-content">
                <div className="tab-pane" id="receiver">
                  <div className="row">
                    <h4 className="info-text">¿Quién recibirá tu remesa?</h4>
                    <div className="col-sm-10 col-sm-offset-1">
                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="material-icons">badge</i>
                        </span>
                        <div className="form-group label-floating">
                          <label htmlFor="ReceiverID" className="control-label">
                            DUI <small>(requerido)</small>
                          </label>
                          <input
                            name="ReceiverID"
                            type="text"
                            value={form.ReceiverID}
                            onChange={handleChange}
                            pattern="[0-9]{8,10}"
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="material-icons">face</i>
                        </span>
                        <div className="form-group label-floating">
                          <label htmlFor="ReceiverName" className="control-label">
                            Nombre completo <small>(requerido)</small>
                          </label>
                          <input
                            name="ReceiverName"
                            type="text"
                            value={form.ReceiverName}
                            onChange={handleChange}
                            pattern="^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$"
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <span className="input-group-addon">
                          <i className="material-icons">phone</i>
                        </span>
                        <div className="form-group label-floating">
                          <label htmlFor="ReceiverPhoneNumber" className="control-label">
                            Número de celular <small>(opcional)</small>
                          </label>
                          <input
                            name="ReceiverPhoneNumber"
                            type="text"
                            value={form.ReceiverPhoneNumber}
                            onChange={handleChange}
                            pattern="^\+?\d+(-\d+)*$"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="remittance">
                  <div className="row">
                    <div className="col-sm-12">
                      <h4 className="info-text">Valor de tu remesa</h4>
                    </div>
                    <div className="col-sm-10 col-sm-offset-1">
                      <div className="form-group label-floating">
                        <label className="control-label">
                          Escribe el valor a enviar (USD)
                        </label>
                        <input
                          name="RemittanceFiatAmount"
                          type="text"
                          value={form.RemittanceFiatAmount}
                          onChange={handleChangeFiatAmount}
                          pattern="^\+?(0|[1-9]\d*)$"
                          min="1"
                          max="999999"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-sm-4 col-sm-offset-1">
                      <div className="col-sm-3">
                        <strong>BTC</strong>
                      </div>
                      <div className="col-sm-7">
                        {(+fiatAmountBtc).toFixed(8)} <strong>₿</strong>
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <div className="col-sm-5 col-sm-offset-1">
                        <strong>Fee</strong>
                      </div>
                      <div className="col-sm-5 col-sm-offset-1">
                        <p>1,0 $</p>
                      </div>
                    </div>
                    <div className="col-sm-4 col-sm-offset-1">
                      <div className="col-sm-5 col-sm-offset-1"></div>
                      <div className="col-sm-5 col-sm-offset-1"></div>
                    </div>
                    <div className="col-sm-7">
                      <div className="col-sm-5 col-sm-offset-1">
                        <strong>Valor total a pagar</strong>
                      </div>
                      <div className="col-sm-5 col-sm-offset-1">
                        <p>{(+totalAmountRemittance).toFixed(8)} ₿</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="resume">
                  <div className="row">
                    <h4 className="info-text">Resumen de la remesa</h4>
                    <div className="col-sm-10 col-sm-offset-1">
                      <div className="row">
                        <div className="col-sm-5">
                          <strong>Remitente:</strong>
                        </div>
                        <div className="col-sm-5">{account}</div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-5">
                          <strong>Valor a enviar (USD):</strong>
                        </div>
                        <div className="col-sm-5">
                          {form.RemittanceFiatAmount} $
                        </div>
                        <div className="col-sm-5">
                          <strong>Valor a enviar (BTC):</strong>
                        </div>
                        <div className="col-sm-5">
                          {(+fiatAmountBtc).toFixed(8)} <strong>₿</strong>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-5">
                          <strong>Destinatario:</strong>
                        </div>
                        <div className="col-sm-5">{toAddress}</div>
                      </div>
                      <br />
                      <div className="row text-center">
                        <div className="col-sm-10 col-sm-offset-1">
                          <p hidden={!txHash}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge"
                              href={`https://explorer.testnet.rsk.co/tx/${txHash}`}
                            >
                              Tx Hash: {txHash}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="wizard-footer">
                <div className="pull-right">
                  <input
                    type="button"
                    className="btn btn-next btn-fill btn-warning btn-wd"
                    name="next"
                    value="Siguiente"
                    disabled={!account}
                  />
                  <button
                    type="submit"
                    className="btn btn-finish btn-fill btn-warning btn-wd"
                    name="finish"
                    disabled={!account || !fiatAmountBtc}
                  >
                    ENVIAR REMESA
                  </button>
                </div>

                <div className="pull-left">
                  <input
                    type="button"
                    className="btn btn-previous btn-fill btn-default btn-wd"
                    name="previous"
                    value="Anterior"
                  />
                </div>
                <div className="clearfix"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
