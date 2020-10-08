import React, {Component, Fragment} from 'react';
import { Card, CardImg, CardText, CardBody, Modal,ModalBody,ModalHeader,Button,Row,Col,Label,
    CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props)
    {
        super();
        this.state={
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }

    
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
      }

    

    handleComment(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        
    }
    render() { 
        return ( 
            <Fragment>
            <Button className="btn btn-default" onClick={this.toggleModal}>
               <span> <i className="fa fa-pencil fa-lg"></i></span>
                Submit Comment
            </Button>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    Submit Comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(value)=>this.handleComment(value)}>
                    <Row className="form-group">
                                <Label htmlFor="rating" md={4}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" id="rating" name="rating"
                                        className="form-control"
                                         >
                                         <option>1</option>
                                         <option>2</option>
                                         <option>3</option>
                                         <option>4</option>
                                         <option>5</option>
                                         <option>6</option>
                                         <option>7</option>
                                         <option>8</option>
                                         <option>9</option>
                                         <option>10</option>
                                    </Control.select>
                                </Col>
                    </Row>
                    <Row className="form-group">
                                <Label htmlFor="author" md={4}>Your Name</Label>
                                <Col md={12}>
                                    <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name" className="form-control"
                                        validators={{
                                            minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            minLength: 'Name should be not less than 3 characters',
                                            maxLength: 'Name should be not greater than 15 characters'
                                        }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={4}>Comment</Label>
                                <Col md={12}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        className="form-control"
                                        validators={{
                                            required
                                        }}
                                        rows="6"
                                         />
                                    <Errors
                                        className="text-danger"
                                        model=".comment"
                                        show="touched"
                                        messages={{
                                            required:'Comment is required'
                                        }}
                                     />
                                </Col>
                            </Row>
                            <Row className="form-group">
                            <Col >
                                <Button type="submit" color="primary" >Submit</Button>
                            </Col>
                            </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
            </Fragment>
         );
    }
}
 

 function RenderDish({dish}) { 
        if (dish != null)
            return(     
               <div className="col-12 col-md-5 m-1">
                   <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                      <CardTitle>{dish.name}</CardTitle>
                      <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
                </FadeTransform>
               </div>
                );
                else
             return(
                 <div></div>
             );
            
    }

    function RenderComments({comments, postComment, dishId}) {
        if (comments != null)
        {
           const commentListItems = comments.map((comment)=> 
           {
               return(
                <Stagger in>
                     <Fade in>
                <li key= {comment.id}>
                <p>{comment.comment}</p>
                <p>{comment.author}</p>
                <p>{comment.date}</p>
            </li>
            </Fade>
            </Stagger>         
               );
          
           });
           return (
            
            <div className="col-12 col-md-6 m-1">
                <h4>Comments</h4>
             <ul> {commentListItems}</ul>      
             <CommentForm dishId={dishId} postComment={postComment} />
            </div>
           
        );
        } 
        else
        return(
            <div></div>
        );
    }

    const  DishDetail = (props) => {
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null) {
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments}
                   postComment={props.postComment}
                    dishId={props.dish.id} />
                    </div>
                </div>
                </div>
            );
        }
        else
        return(
            <div></div>
        );
           
    }


export default DishDetail;

