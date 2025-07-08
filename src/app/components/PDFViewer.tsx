'use client';

import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import pkg from 'pdfjs-dist/package.json';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


interface PDFViewerProps {
  pdfUrl: string;
  pageNumber: number;
}

export default function PDFViewer({ pdfUrl, pageNumber }: PDFViewerProps) {

  // console.log(`PDFViewer: pdfUrl=${pdfUrl}, pageNumber=${pageNumber}`);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const workerSrc = `https://unpkg.com/pdfjs-dist@${pkg.version}/build/pdf.worker.js`;

  return (
    <Worker workerUrl={workerSrc}>
      <div style={{
        height: '750px',
        width: '100%',
        position: 'relative',
        zIndex: 1000,
        backgroundColor: 'white',
        border: '1px solid #ccc'
      }}>
        <Viewer
          fileUrl={pdfUrl}
          initialPage={pageNumber} // Page numbers are zero-based in the viewer
          // defaultScale={SpecialZoomLevel.PageFit}

          plugins={[
            defaultLayoutPluginInstance,
          ]}
        />
      </div>
    </Worker>
  );
}