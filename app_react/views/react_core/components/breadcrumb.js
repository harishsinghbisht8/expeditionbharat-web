/** 
 * @param selected {String} Selected tab of the header navigation
 */

import { h, render, Component } from 'preact';

export default class Breadcrumb extends Component {
    render() {
    	let breadcrumbArray = this.props.breadcrumbArray;

        return (        
        <ol itemscope="itemscope" itemtype="http://schema.org/BreadcrumbList" className="breadcrumbs"> 
            {
                breadcrumbArray.map((breadcrumbItem, index) => {
                    if(breadcrumbItem.l){
                        return (
                            <li itemprop="itemListElement" itemscope="itemscope" itemtype="http://schema.org/ListItem">
                            <span>
                                <a itemprop="item" className="breadcrumb-item" href={breadcrumbItem.l}>
                                    <span itemprop="name">{breadcrumbItem.t}</span>
                                </a>
                                <meta itemprop="position" content={index + 1} />
                                <span className="arrow-marker">››</span>
                            </span>
                        </li>)  
                    }else{
                        return (
                            <li>
                               <span className="nolink-text"> {breadcrumbItem.t} </span>
                            </li>
                        )
                    }
                })
            }   
        </ol>        
        )
    }
};

/* This is how this component is used


	let breadcrumbArray = [];

    breadcrumbArray.push({
        t : "Home",
        l : "/"
    })

    breadcrumbArray.push({
        t : "Flights",
        l : "/flights"
    })

    breadcrumbArray.push({
        t : `Flights`
    })

    return (
        <ReactifyCore.Components.Breadcrumb breadcrumbArray={breadcrumbArray}/>
    )
*/