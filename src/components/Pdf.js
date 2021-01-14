import axios from "axios";
import { useState } from "react";
import { Page } from "react-pdf";
import { Document } from "react-pdf/dist/esm/entry.webpack";
import React, { Component } from "react";
import "../css/styles-pdf.css";
import { useParams } from "react-router-dom";
import { Lector, NewSheet } from './HojaTrucos';

const NewS = (i) => {
  NewSheet(i)
}

const MyApp = (props) => {

  var base = "http://localhost:8080/file/";
  var params = useParams();

  
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState( 1 + parseInt(localStorage.getItem(params.nombrepdf )));
  const [text, setText] = useState("");
  const [escala, setscala] = useState(1.3);
  const selectT = document.querySelectorAll(".selectect-text");
  /////////////////////////////////Aroca
  const [bot, setbot] = useState(false);
  const [nuevaHoja, setNuevaHoja] = useState(false);
  const [arr, setArr] = useState([1])  
  const [titulo, setTitulo] = useState('')
  const [tit, setit] = useState('')
  const [hojaTrucos, setHojaT] = useState('')
  ////////////////////////////////
  selectT.forEach((elem) => {
    elem.addEventListener("mouseup", sText);
  });
  ////////////////////////////////////Aroca
  const Changed = e => setit(e.target.value)
  const chanTit = e => setTitulo(e.target.value)
  const chanText = e => {setText(e.target.value)}

  if(pageNumber === null && localStorage.getItem(params.nombrepdf ) === null){
    setPageNumber(1)
  }


  function sText(event) {
    const selectT = window.getSelection().toString().trim();
    setText(selectT);
  }

  function onItemClick({ pageNumber: itemPageNumber }) {
    setPageNumber(itemPageNumber);
    localStorage.setItem( params.nombrepdf, itemPageNumber )    
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    if( localStorage.getItem(params.nombrepdf ) === null){
      setPageNumber(1)
    } else {
      console.log(localStorage.getItem(params.nombrepdf))      
      setPageNumber( parseInt(localStorage.getItem(params.nombrepdf )))
    }    
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
    localStorage.setItem( params.nombrepdf, pageNumber )
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  ////////////////////////Aroca
  const Radio = (i,) => {
    return (
      <div >
        <label className='container' htmlFor='hojas'> 
          <input className='checkbox' type="radio" name='hojas' value={i.ID} onClick={() => setHojaT(i.ID)} />                       
          {i.Titulo}
        </label> 
      </div>
    )
  }

  const nTruco = () => {
    var obj = {
      'cheatsheet': hojaTrucos,
      'contenido': text,
      'titulo': titulo
    }
    axios
      .post('http://localhost:8080/addCheat', obj, {
        headers: {
          token: localStorage.getItem("Session"),
        }
      }).then((e) => {
        console.log(e.data)
      })
  }
  

  /////////////////////////////////////

  return (
    <>
      <div className="grid">
        <div className="pdfnav">
          <div id="buttonav">
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Anterior
            </button>
            <p>Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}</p>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Siguiente
            </button>
          </div>
          <div id="buttonzoom">
            <button
              onClick={() => {
                setscala(escala + 0.1);
              }}
            >
              +
            </button>
            <button
              onClick={() => {
                escala > 1.3 ? setscala(escala - 0.1) : setscala(1.3);
              }}
            >
              -
            </button>
          </div>


          <div className='botones-Modal'>
            <div>
              {bot &&
                <div className="modal" >
                  <div className="modal-content">
                    <div className='grid-modal' >                      
                      <div id='text'>                        
                          {
                            arr.length > 0 &&
                            <input  id='titulo' onChange={chanTit} type="text" name="Hoja" placeholder="Nombre de la nota" />
                          }                        
                          <textarea id='textArea' value={text} onChange={(e) => chanText(e)}></textarea>                        
                      </div>
                      <div id='radio'>
                        {
                          arr.length > 0 && arr.map((i) => Radio(i))
                        }
                      </div>
                      
                      <div id='botones-modal'>                        
                        <button className='bot-m' onClick={() => setbot(false)}>salir</button>
                          {text.length > 5 && hojaTrucos.length > 10 && titulo.length > 3 &&
                            <button className='bot-m' onClick={() => { nTruco(); setbot(false) }}>  Guardar truco  </button >
                          }
                        <button className='bot-m' onClick={() => { setNuevaHoja(true); setbot(false) }}>Nueva Hoja</button >                        
                      </div>
                    </div>
                  </div>
                </div>
              }
              <button className='bot-m' onClick={async () => { setArr(await Lector()); setbot(true) }} >
                Nota Nueva
              </button >
            </div>
            <div >
              {nuevaHoja &&
                <div className="modal" >
                  <div className=" modal-content2 ">
                    <div className='grid-modal'>                    
                    <div id='botones-modal'>
                    <input id='titulo2' onChange={Changed} type="text" name="Hoja" placeholder="Nombre nueva hoja " />
                      <button className='bot-m' onClick={() => { NewS(tit); setNuevaHoja(false) }}>Nueva</button >
                      <button className='bot-m' onClick={() => setNuevaHoja(false)}>salir</button>
                    </div>                    
                    </div>
                  </div>
                </div>
              }
              <button className='bot-m' onClick={() => setNuevaHoja(true)} >
                Nueva Hoja
              </button >
            </div>
          </div>

        </div>
        <div className="selectect-text">
          <Document
            file={base.concat(params.nombrepdf)}
            onLoadSuccess={onDocumentLoadSuccess}
            onItemClick={onItemClick}
            className="document selectect-text"
          >
            <Page
              pageNumber={pageNumber}
              className="hoja  selectect-text"
              scale={escala.toString()}
            />
          </Document>
        </div>
      </div>

    </>
  );
};

export default class Pdf extends Component {
  render() {
    return (
      <div>
        <div className="hojas">
          <MyApp />
        </div>
      </div>
    );
  }
}
