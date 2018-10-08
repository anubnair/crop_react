import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactCrop from 'react-image-crop'
import Dropzone from 'react-dropzone'
import 'react-image-crop/dist/ReactCrop.css';
import {image64toCanvasRef} from './utils'

const image_max_size = 1000000 // bytes
const accepted_file_types = 'image/x-png, image/gif, image/png, image/jpeg'
const accepted_file_types_array = accepted_file_types.split(",").map((item) => {return item.trim()})

class App extends Component {
  constructor(props) {
    super(props)
    this.imagePreviewCanvasRef = React.createRef()
    this.state = {
        imgSrc: null,
        crop: {
            aspect:1/1
        }
    }
  }

  verifyFile = (files) => {
      if (files && files.length > 0) {
          const currentFile = files[0]
          const currentFileType = currentFile.type
          const currentFileSize = currentFile.size
          if(currentFileSize > image_max_size) {
            alert("This file is too big.This file is not allowed. " + currentFileSize + "bytes is too large")
            return false
          }
          if(!accepted_file_types_array.includes(currentFileType)){
              alert("This file is not allowded. Only images are allowded")
              return false
          }
          return true
      }
  }

  handle_On_Drop = (files, rejFiles) => {
    console.log(files)
    console.log('rejected files :', rejFiles)
    if (rejFiles && rejFiles.length > 0){
        console.log(rejFiles)
        this.verifyFile(rejFiles)
    }
    if (files && files.length > 0){
        const isVerified = this.verifyFile(files)
        if (isVerified){
            //console.log(files)
            const currentFile = files[0]
            const reader = new FileReader()
            reader.addEventListener("load", ()=> {
                console.log(reader.result)
                this.setState({
                    imgSrc: reader.result
                })
            }, false)
            reader.readAsDataURL(currentFile)
        }
    }

  }
  handle_image_loaded = (image) => {
      console.log(Image)
  }

  handleCrop = (crop) => {
      console.log(crop)
      this.setState({crop:crop})
  }

  handle_crop_complete = (crop, pixelCrop) => {
      console.log(crop, pixelCrop)
      const canvasRef = this.imagePreviewCanvasRef.current
      const {imgSrc} = this.state
      image64toCanvasRef(canvasRef,imgSrc, pixelCrop)
  }
  render() {
      const {imgSrc} = this.state
      const {crop} = this.state
    return (
      <div>
        <h1> Crop a file </h1>
        {imgSrc !== null ? 
            <div>
                <ReactCrop 
                    src={imgSrc}
                    crop={this.state.crop}
                    onImageLoaded={this.handle_image_loaded}
                    onComplete={this.handle_crop_complete}
                    onChange={this.handleCrop}/>

                    <br/>
                    <p>Preview Crop </p>
                    <canvas ref={this.imagePreviewCanvasRef}></canvas>
            </div>  
            :

            <Dropzone onDrop={this.handle_On_Drop} multiple={false} accept={accepted_file_types} maxSize={image_max_size}> Drop a file here! </Dropzone>
        }
      </div>
    );
  }
}

export default App;
