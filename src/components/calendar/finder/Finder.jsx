import React from "react";
import StepFinder from "./Stepfinder";
import "./finder.css"

class Finder extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
        <>
            {this.props.openModal ? (
                
                    <StepFinder  
                        isModify={this.props.isModify}
                        eventToCreate={this.props.event}
                        activityToModify={this.props.activity} //notimplemented
                        closeModal={this.props.closeModal}
                        addEtape={this.props.addEtape}
                    />
                ) : ''
            }
           {/*  {this.state.modalDirectionData.isVisible ?(
                <div className="StepFinder">
                    <DirectionFinder 
                                closeModal={this.closeDirectionModal}
                                modalData={this.state.modalData} 
                                addEtape={this.props.addEtape}  />
                </div>) : ''
            } */}
        </>
        );
    }


}

export default Finder;