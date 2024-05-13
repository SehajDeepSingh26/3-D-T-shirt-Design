import {useState} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import html2canvas from "html2canvas";
import {reader} from '../config/helpers'
import {EditorTabs, FilterTabs, DecalTypes} from '../config/constants';
import {fadeAnimation, slideAnimation} from '../config/motion';

import {  ColorPicker, FilePicker, Tab, CustomButton, DownloadButton, } from '../components';


const Customizer = () => {

    const snap = useSnapshot(state);

    //* To keep track of local state of our application

    const [file, setFile] = useState('');

    const [prompt, setPrompt] = useState(''); 
    const [generatingImg, setGeneratingImg] = useState(false); 

            //^ this will tell which custom tab we are changing -> color, filePicker or AI genertation prompt.
    const[activeEditorTab, setActiveEditorTab] = useState("");      

            //^ this will trigger, are we showing logo, or full tshirt texture.
    const[activefilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false,        
    });

    // const handleSubmit = async (type) => {
    //     if(!prompt) return alert("Please enter a prompt");
    
    //     try {
    //         setGeneratingImg(true);
      
    //         const response = await fetch('http://localhost:8080/api/v1/dalle', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json'
    //           },
    //           body: JSON.stringify({
    //             prompt,
    //           })
    //         })
      
    //         const data = await response.json();
      
    //         handleDecals(type, `data:image/png;base64,${data.photo}`)
    //       } catch (error) {
    //         alert(error)
    //       } finally {
    //         setGeneratingImg(false);
    //         setActiveEditorTab("");
    //       }
    //     }

    //^Show tab content depending on the Active Tab
    const generateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker/>
            case "filepicker":
                return <FilePicker
                  file = {file}
                  setFile = {setFile}
                  readFile = {readFile}

                />
            // case "aipicker":
            //     return <AiPicker
            //       prompt = {prompt}
            //       setPrompt = {setPrompt}
            //       generatingImg = {generatingImg}
            //       handleSubmit = {handleSubmit}
            //     />
            default:
                return null;    
        }
    }

    

    const handleDecals = (type, result)  => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;

        if(!activefilterTab[decalType.filterTab]){ //filterTab
            handleActiveFilterTab(decalType.filterTab);    //^to keep track of which tab we are accessing
        }
    }
    const handleActiveFilterTab = (tabName) => {
        switch (tabName){
            case "logoShirt":
                state.isLogoTexture = !activefilterTab[tabName];    //^to toggle logo btn on/off
                break;
            case "stylishShirt":
                state.isFullTexture = !activefilterTab[tabName]; //^to toggle Texture  btn on/off
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;    //^default values as set in .store/index.js file

        }

        //^ above function is just changing and updating the state.

        //^ Now, we actually update the changes on our webPage.
        setActiveFilterTab((prevState) => {
            return{
                ...prevState,
                [tabName]: !prevState[tabName]  //^To toggle it on / off.
            }
        })

    }
    const readFile = (type) =>{
        reader(file)
            .then((result) => {
                handleDecals(type, result);
                setActiveEditorTab("");         //^To reset active editor tab


            })
    }

    // Function to capture the canvas and initiate download
  const captureCanvasAndDownload = () => {
    const canvasElement = document.getElementById("your-canvas-id");

    if (!canvasElement) {
      console.error("Canvas element not found.");
      return;
    }

    // Use html2canvas to capture the canvas content as an image
    html2canvas(canvasElement).then((canvas) => {
      // Convert the captured canvas to a data URL and initiate the download
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "3D_Model_Image.png";
      link.href = image;
      link.click();
    });
  };

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div 
                      key="custom" 
                      className='absolute top-0 left-0 z-10' 
                    {...slideAnimation('left')} 
                    >
                                                            {/* //^ This is for the Left-centered Panel  */}
                        <div className="flex items-center min-h-screen">         
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) =>(
                                    <Tab key={tab.name}
                                      tab = {tab}
                                      handleClick={() => {setActiveEditorTab(tab.name)}}
                                    />
                                ))}
                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    
                    
                    <motion.div
                    className='absolute z-10 top-5 right-5'               //^ This is for the Back Button on Top-Right
                    {...fadeAnimation}
                    >    
                        <CustomButton 
                          type="filled"
                          title="Home"
                          customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                          handleClick={() => state.intro = true}
                        />{" "}
                        <DownloadButton 
                          type="filled"
                          title="Download"
                          handleClick={captureCanvasAndDownload}
                          customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                        />{" "}
                    </motion.div>
                    

                    <motion.div
                      className='filtertabs-container'               //^ Down-Centred 2 tabs
                      {...slideAnimation('up')}
                    >
                        {FilterTabs.map((tab) =>(
                            <Tab 
                              key={tab.name}
                              tab = {tab}
                              isFilterTab
                              isActiveTab = {activefilterTab[tab.name]}
                              handleClick={() => {handleActiveFilterTab(tab.name)}}
                            />
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Customizer
