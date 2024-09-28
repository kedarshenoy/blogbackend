
////////////////////////////////////////////
import React, { useRef, useEffect, useState } from "react";
import CommandImg from '../../Assets/icons/code.svg'
import Link from '../../Assets/icons/copy.svg'
import H1 from '../../Assets/icons/h1.svg'
import H2 from '../../Assets/icons/h2.svg'
import Image from '../../Assets/icons/image.svg'
import '../../styles/Takepost.css'

function CustomInput({setShowsecond}) {
  const contentEditableRef = useRef(null);
  const [postTitle , setPostTitle] = useState();

  const focusAndPlaceCursor = () => {
    const contentDiv = contentEditableRef.current;
    if (contentDiv) {
      contentDiv.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(contentDiv.firstChild, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    focusAndPlaceCursor();
  }, []);

  const addStyledInputBox = (style, placeholder, type) => {
    const inputWrapper = document.createElement("div");
    inputWrapper.setAttribute("contentEditable", "false");
    inputWrapper.setAttribute("data-type", type); // Set the data-type attribute
    inputWrapper.style.marginBottom = "10px";
    inputWrapper.style.paddingRight = "10px";
    inputWrapper.style.width = "95%";
  
    Object.assign(inputWrapper.style, style.wrapperStyle);
  
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("placeholder", placeholder);
    Object.assign(inputElement.style, style.inputStyle);
  
    const removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.onclick = () => inputWrapper.remove();
  
    Object.assign(removeButton.style, {
      backgroundColor: "transparent",
      border: "none",
      color: "red",
      fontSize: "16px",
      cursor: "pointer",
      padding: "0",
      marginLeft: "5px",
    });
  
    inputWrapper.appendChild(inputElement);
    inputWrapper.appendChild(removeButton);
  
    const contentDiv = contentEditableRef.current;
    if (contentDiv) {
      const br = document.createElement("br");
      contentDiv.appendChild(inputWrapper);
      contentDiv.appendChild(br);
      contentDiv.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStartAfter(inputWrapper);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  
const addLinkInputBox = () =>
    addStyledInputBox(
      {
        wrapperStyle: {
          border: "1px solid #87CEEB",
          borderRadius: "10px",
          display:'flex',
          justifyContent:'space-between'
        },
        inputStyle: {
          width: "80%",
          fontSize: "16px",
          color: "pink",
          border: "none",
        },
      },
      "Add Link",
      "link"
    );

  const addFileInputBox = () => {
    const inputWrapper = document.createElement("div");
    inputWrapper.setAttribute("contentEditable", "false");
    inputWrapper.setAttribute("data-type", "image");
    inputWrapper.style.marginBottom = "10px";
    inputWrapper.style.border = "1px solid #FF4500"; // Pink border for the file input
    inputWrapper.style.width = "95%"; // 95% width for the input wrapper
    inputWrapper.style.borderRadius = "10px";
    inputWrapper.style.paddingRight = "10px";
    inputWrapper.style.display = "flex"; // Align input and button in the same line
    inputWrapper.style.alignItems = "center"; // Vertically align items
    inputWrapper.style.justifyContent ="space-between";
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "file");
    inputElement.style.width = "95%"; // Slightly reduced width to make space for the button
    inputElement.style.border = "none"; // Remove any default border
    inputElement.style.padding = "5px"; // Optional: add some padding for better spacing

    const removeButton = document.createElement("button");
    removeButton.textContent = "x";
    removeButton.onclick = () => inputWrapper.remove();

    Object.assign(removeButton.style, {
      backgroundColor: "transparent",
      border: "none",
      color: "red",
      fontSize: "16px",
      cursor: "pointer",
      padding: "0",
      marginLeft: "10px", // Add some spacing between the input and the button
      flexShrink: "0", // Prevent the button from shrinking
    });

    inputWrapper.appendChild(inputElement);
    inputWrapper.appendChild(removeButton);

    const contentDiv = contentEditableRef.current;
    if (contentDiv) {
      const br = document.createElement("br");
      contentDiv.appendChild(inputWrapper);
      contentDiv.appendChild(br);
      contentDiv.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStartAfter(inputWrapper);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const addNormalInputBox = () =>
    addStyledInputBox(
      {
        wrapperStyle: {
          border: "2px solid #00FFFF",
          borderRadius: "10px",
                    display:'flex',
          justifyContent:'space-between'
        },
        inputStyle: {
          width: "80%",
          fontSize: "16px",
          color: "pink",
          border: "none",
        },
      },
      "Add Command",
      "Code"
    );

  const addHeadingInputBox = () =>
    addStyledInputBox(
      {
        wrapperStyle: {
          border: "1px solid #FFC0CB",
          // padding: "10px",
          backgroundColor: "transparent",
          borderRadius: "10px",
                    display:'flex',
          justifyContent:'space-between'
        },
        inputStyle: {
          width: "80%",
          fontSize: "24px",
          fontWeight: "bold",
          color: "white",
          border: "none",
        },
      },
      "Add Heading",
      "Heading"
    );

  const addSubheadingInputBox = () =>
    addStyledInputBox(
      {
        wrapperStyle: {
          border: "1px solid #00FF00",
          // padding: "8px",
          backgroundColor: "transparent",
          color: "white",
          borderRadius: "10px",
                    display:'flex',
          justifyContent:'space-between'
        },
        inputStyle: {
          width: "80%",
          fontSize: "20px",
          fontWeight: "bold",
          color: "white",
          border: "none",
        },
      },
      "Add Subheading",
      "Subheading"
    );
    const collectDocumentContent = () => {
      const contentDiv = contentEditableRef.current;
      if (!contentDiv) return [];
    
      const documentContent = [];
    
      const children = contentDiv.childNodes;
    
      children.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          // Capture plain text nodes
          const text = child.textContent.trim();
          if (text) {
            documentContent.push({
              text: text,
              type: "text",
            });
          }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.nodeName === "DIV") {
            const inputElement = child.querySelector("input[type='text'], input[type='file']");
            if (inputElement) {
              const placeholder = inputElement.getAttribute("placeholder");
              let type = "text";
              if (placeholder === "Add Heading") {
                type = "heading";
              } else if (placeholder === "Add Subheading") {
                type = "subheading";
              } else if (placeholder === "Add Command") {
                type = "code";
              } 
              else if (placeholder === "Add Link") {
                type = "link";
              }else if (inputElement.type === "file") {
                const file = inputElement.files[0];
                if (file) {
                  documentContent.push({
                    type: "file",
                    file, // include the file object
                    name: file.name, // file name for reference
                  });
                }
                return; // Skip adding text info for the file input
              }
              documentContent.push({
                text: inputElement.value || placeholder,
                type,
              });
            }
          }
        }
      });
    
      return documentContent;
    };
    


    // const collectDocumentContent = () => {
    //   const contentDiv = contentEditableRef.current;
    //   if (!contentDiv) return [];
      
    //   const documentContent = [];
      
    //   const children = contentDiv.childNodes;
      
    //   children.forEach((child) => {
    //     if (child.nodeType === Node.TEXT_NODE) {
    //       // Capture plain text nodes
    //       const text = child.textContent.trim();
    //       if (text) {
    //         documentContent.push({
    //           text: text,
    //           type: "text",
    //         });
    //       }
    //     } else if (child.nodeType === Node.ELEMENT_NODE) {
    //       if (child.nodeName === "DIV") {
    //         const inputElement = child.querySelector("input[type='text'], input[type='file']");
    //         if (inputElement) {
    //           const placeholder = inputElement.getAttribute("placeholder");
    //           const dataType = child.getAttribute("data-type"); // Get the data-type attribute
    
    //           let type = "text";
    //           if (dataType === "heading") {
    //             type = "heading";
    //           } else if (dataType === "subheading") {
    //             type = "subheading";
    //           } else if (dataType === "code") {
    //             type = "code";
    //           } else if (dataType === "link") {
    //             type = "link"; // Add this line to handle link inputs
    //           } else if (inputElement.type === "file") {
    //             const file = inputElement.files[0];
    //             if (file) {
    //               documentContent.push({
    //                 type: "file",
    //                 file, // include the file object
    //                 name: file.name, // file name for reference
    //               });
    //             }
    //             return; // Skip adding text info for the file input
    //           }
              
    //           if (type === "link") {
    //             documentContent.push({
    //               text: inputElement.value || placeholder,
    //               type: "link", // Specify the type as link
    //             });
    //           } else {
    //             documentContent.push({
    //               text: inputElement.value || placeholder,
    //               type,
    //             });
    //           }
    //         }
    //       }
    //     }
    //   });
      
    //   return documentContent;
    // };
    

    // const collectDocumentContent = () => {
    //   const contentDiv = contentEditableRef.current;
    //   if (!contentDiv) return [];
      
    //   const documentContent = [];
    //   const children = contentDiv.childNodes;
    
    //   children.forEach((child) => {
    //     if (child.nodeType === Node.TEXT_NODE) {
    //       // Capture plain text nodes
    //       const text = child.textContent.trim();
    //       if (text) {
    //         documentContent.push({
    //           text: text,
    //           type: "text",
    //         });
    //       }
    //     } else if (child.nodeType === Node.ELEMENT_NODE) {
    //       if (child.nodeName === "D") {
    //         const inputElement = child.querySelector("input[type='text'], input[type='file']");
    //         if (inputElement) {
    //           const placeholder = inputElement.getAttribute("placeholder");
    //           const dataType = child.getAttribute("data-type"); // Get the data-type attribute
    
    //           let type = "text";
    //           // Use the data-type attribute to determine the correct type
    //           if (dataType === "heading") {
    //             type = "heading";
    //           } else if (dataType === "subheading") {
    //             type = "subheading";
    //           } else if (dataType === "code") {
    //             type = "code";
    //           } else if (dataType === "link") {
    //             type = "link"; // Ensure 'link' type is captured
    //           } else if (inputElement.type === "file") {
    //             const file = inputElement.files[0];
    //             if (file) {
    //               documentContent.push({
    //                 type: "file",
    //                 file, // Include the file object
    //                 name: file.name, // File name for reference
    //               });
    //             }
    //             return; // Skip adding text info for the file input
    //           }
    
    //           documentContent.push({
    //             text: inputElement.value || placeholder,
    //             type,
    //           });
    //         }
    //       }
    //     }
    //   });
    
    //   return documentContent;
    // };

    // just to check the git  
    const handleSave = () => {
      const documentContent = collectDocumentContent();
      
      const formData = new FormData();
      // console.log(postTitle)
      const postname ={text:postTitle,type:'PostTitle'};
      formData.append(`content_${0}`, JSON.stringify(postname));

      const bannerImage= document.getElementById('postThumbnail');
      if (bannerImage.files && bannerImage.files.length > 0) {
        // Get the first file from the input
        const banner = bannerImage.files[0];
        formData.append(`file_1`, banner);
      }
    
      documentContent.forEach((item, index) => {
        if (item.type === "file") {
          formData.append(`file_${index+2}`, item.file);
          
        } else {
          formData.append(`content_${index+2}`, JSON.stringify(item));
          console.log(item)
        }
      });
      // Example API call
      let callapi = localStorage.getItem('Token');
      (callapi !== 'Guest') ?
      
        fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
          headers: {
            "authorization": `Bearer ${callapi}`, 
                
          }
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);
            setShowsecond(true);
          })
          .catch((error) => {
            console.error("Error uploading document:", error);
          })
          :
          window.alert('Join the Discussion: Log In to Post')
      
      }
  
  return (
    <div style={styles.editorContainer}>
      
      {/* <div className="TitleBlogMaindiv"> */}
      <div  className='posttitlelable'>Post Title *</div>
        <input type="text" id='postTitle' placeholder="Post Title"  value={postTitle} onChange={(e)=>setPostTitle(e.target.value)} className="TitleBlogMain"/>
        <div  className='posttitlelable'>Post Thumbnail <span>(Optional)</span></div>
        <input type='file' id="postThumbnail" className="TitleBlogMain"/>
     
      {/* </div> */}
      <div style={styles.header}>
        
          <button className='AddbtnPost' style={styles.button} onClick={addNormalInputBox}>
            <img src={CommandImg} alt='' style={styles.icon} className="iconsAdd"/>
            Add Command
          </button>
          <button className='AddbtnPost' style={styles.button} onClick={addHeadingInputBox}>
            <img src={H1} alt='' style={styles.icon} className="iconsAdd"/>

            Add Heading
          </button>
          <button className='AddbtnPost' style={styles.button} onClick={addSubheadingInputBox}>
            <img src={H2} alt='' style={styles.icon} className="iconsAdd"/>

            Add Subheading
          </button>
          <button className='AddbtnPost' style={styles.button} onClick={addFileInputBox}>
            <img src={Image} alt='' style={styles.icon} className="iconsAdd"/>

            Add Image
          </button>
          <button className='AddbtnPost' style={styles.button} onClick={ ()=>addLinkInputBox()}>
            <img src={Link} alt='' style={styles.icon} className="iconsAdd"/>
            Add Link
          </button>
        
      </div>
      <div
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        style={styles.textArea}
      >
        <p></p>
      </div>

      {/* <button > LOG DATA</button> */}
      <div className='PublsiBtn' onClick={()=>{console.log(handleSave())}}>Publish Post
      </div>
    </div>
  );
}

const styles = {
  editorContainer: {
    position: "relative",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap:'10px',
    marginBottom: "20px",
  },
  icon: {
    // width: '1.5rem',
    // height: '1.5rem',
    // marginRight: '10px',
  },
  // addButton: {
  //   fontSize: "16px",
  //   fontWeight: '700',
  //   backgroundColor: "transparent",
  //   color: "silver",
  //   border: "1px solid silver",
  //   // padding: "10px",
  //   borderRadius: "5px",
  //   cursor: "pointer",
  //   marginRight: "10px",
  // },
  headingButton: {
    fontSize: "16px",
    backgroundColor: "transparent",
    color: "silver",
    fontWeight: '700',
    border: "1px solid silver",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  subheadingButton: {
    fontSize: "16px",
    // backgroundColor: "#007BFF",
    // color: "white",
    backgroundColor: 'transparent',
    color: 'silver',
    border: "1px solid silver",
    // border: "none",
    fontWeight: '700',
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  linkButton: {
    fontSize: "16px",
    // backgroundColor: "#800080", // Purple background for the button
    // color: "white",
    backgroundColor: 'transparent',
    // background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
    color: 'silver',
    fontWeight: '700',
    border: "1px solid silver",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  fileButton: {
    fontSize: "16px",
    fontWeight: '700',

    // backgroundColor: "#FFC107",
    // color: "white",
    backgroundColor: 'transparent',

    color: 'silver',
    // boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF',
    border: "1px solid silver",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",

  },
  textArea: {
    // width: "100%",
    minHeight: "300px",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    color: "white",
    textAlign: 'left',
    // backgroundColor:'rgb(1, 1, 1,0.5)'
  },
  button: {
    fontWeight: '700',
    backgroundColor: "transparent",
    color: "silver",
    border: "1px solid silver",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

};

export default CustomInput;
