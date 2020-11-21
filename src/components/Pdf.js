
import { useState  } from 'react';
import { Page } from 'react-pdf'
import { Document } from 'react-pdf/dist/esm/entry.webpack';

import '../css/styles-pdf.css';


import pdf from './Full Stack JavaScript Learn Backbone.js, Node.js, and MongoDB by Azat Mardan (z-lib.org).pdf'

const MyApp = () =>{

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onItemClick({ pageNumber: itemPageNumber }) {
      setPageNumber(itemPageNumber);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
            <Document
                file={pdf}
                onLoadSuccess={onDocumentLoadSuccess}
                onItemClick={onItemClick}
                className="document"
            >
                <Page 
                    pageNumber={pageNumber} 
                    className='hoja'
                />
            </Document>
            <div>
                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </p>
                <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    Previous
          </button>
                <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next
          </button>
            </div>
        </>
    );
}

const  Pdf = () => {
    
        return (
            <div>
                <div className='hojas'>
                    <MyApp />
                </div>
            </div>
        )
    
}

export default Pdf