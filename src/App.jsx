import React, { Component, useState } from 'react';
import './App.css';
import Feed from "./screens/Feed.jsx";
import FullThread from "./screens/fullThread.jsx";

import NavBar from './components/NavBar.jsx'
import Question from './Question';
import {
  Card, CardImg, CardBody, Button, Form, FormGroup, Label, Input, FormText, Badge, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import firebase from './firebase.js';

import jacob from "./img/jacob.jpg";
import saarang from "./img/saarang.jpg";
import jason from "./img/jason.jpg";
import atli_sucks from "./img/atli-sucks.jpg";

const db = firebase.firestore();

// dark theme
const theme1 = {
  header: {
    backgroundColor: '#222',
    color: '#fff',
  },
  body: {
    backgroundColor: '#333',
  },
  footer: {
    backgroundColor: '#222',
    color: '#ccc',
  },
  line: {
    backgroundColor: '#fff',
  },
  link: {
    color: '#fff',
  }
};

// light theme
const theme2 = {
  header: {
    backgroundColor: '#fff',
    color: '#000',
  },
  body: {
    backgroundColor: '#ccc',
  },
  footer: {
    backgroundColor: '#fff',
    color: '#333'
  },
  line: {
    backgroundColor: '#222',
  },
  link: {
    color: '#000',
  }
};

const SocialDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="dark" caret>
        Social
        </DropdownToggle>
      <DropdownMenu>
        <DropdownItem><a href={props.github}>Github</a></DropdownItem>
        <DropdownItem><a href={props.instagram}>Instagram</a></DropdownItem>
        <DropdownItem><a href={props.gmail}>Mail</a></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

const AboutModal = (props) => {
  const {
    className,
    theme
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color={theme === 1 ? 'light' : 'dark'} block onClick={toggle}>Who?</Button>
      <Modal returnFocusAfterClose={false} isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Us</ModalHeader>
        <ModalBody>
          <div className="cardcontainer">
            <Card className="card">
              <CardImg top width="100%" src={jason} alt="Jason Zhang" />
              <CardBody>
                <h3 class="aboutname">Jason Zhang</h3>
                <SocialDropdown github="https://github.com/minisounds" instagram="https://www.instagram.com/jason.zhang848/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=jzscuba@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={jacob} alt="Jacob Ismael" />
              <CardBody>
              <h3 class="aboutname">Jacob Ismael</h3>
                <SocialDropdown github="https://github.com/jacobismael" instagram="https://www.instagram.com/jacobismael16/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=jacob.ismael@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={saarang} alt="Saarang Bondalapati" />
              <CardBody>
                <h3 class="aboutname">Saarang Bondalapati</h3>
                <SocialDropdown github="https://github.com/saarangbond" instagram="https://www.instagram.com/saarang.bond.05/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=saarang.bondalapati@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
            <Card className="card">
              <CardImg top width="100%" src={atli_sucks} alt="Atli Arnarsson" />
              <CardBody>
              <h3 class="aboutname">Atli Arnarsson</h3>
                <SocialDropdown github="https://github.com/atli-a" instagram="https://www.instagram.com/atli_i_guess/?hl=en" gmail="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&to=atli.arnarsson@gmail.com"></SocialDropdown>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      d: new Date(),
      questions: [],
      filteredQuestions: [],
      currentQuestion: [],
      theme: 1,
      styles: { ...theme2, ...theme1 },
      width: 0,
      height: 0,
      errormessage: '',
      seeingFull: false,
      loading_data: true,
      loaded: 0,
      update: 0,
      tempUpvotes: 0,
    };

    this.user = {
      name: 'you',
    }


    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    db.collection("questions")
      .get()
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => new Question(doc.data().title, doc.data().author, doc.data().timestamp, doc.id, doc.data().upvotes, doc.data().tags));
      }).then((data) => {
        this.setState({
          questions: data,
          filteredQuestions: data,
          loading_data: false,
        })
      });

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  changeTheme = () => {
    this.setState({
      theme: this.state.theme === 1 ? 2 : 1,
      styles: this.state.theme === 1 ? { ...theme2 } : { ...theme1 },
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    let val = event.target["text"].value;
    let t = event.target["select"].value;
    if (val === "") {
      let err = <FormText color="danger">You cannot post nothing!</FormText>;
      this.setState({ errormessage: err });
    } else {
      this.setState({ errormessage: '' });

      let date = (new Date()).toString();
      var id = null;

      firebase.firestore()
        .collection('questions')
        .add({
          title: val,
          author: this.user.name,
          upvotes: 0,
          downvotes: 0,
          timestamp: date,
          tags: t,
        }).then((docRef) => {
          firebase.database().ref('audit log').push(date + ": created a new post");
          id = docRef.id;
        });
      let pushArray = [...this.state.filteredQuestions]
      let q = new Question(val, this.user.name, (new Date()).getTime(), id, 0, t);
      pushArray.push(q)
      this.setState({
        filteredQuestions: pushArray
      })

      // Unused Reply Database code
      /* 

      firebase.firestore().collection('questions').doc(q.getText()).collection('replies').add({
          title: this.state.text,
          author: 'devs',
          upvotes: 0,
          downvotes: 0,
          timestamp: q.getTime(),
        });

      */

      this.setState({ update: 0 });
      event.target["text"].value = "";
    }
  }

  changeHandler = (event) => {
    let val = event.target.value;
    this.setState({ text: val });
  }

  upvote = (id) => {
    let db = firebase.firestore()
    db
      .collection('questions')
      .doc(id).get().then((doc) => {
        //console.log(doc.data())
        //console.log(doc.data().upvotes)
        this.setState({tempUpvotes: doc.data().upvotes})
      })
    db
      .collection('questions')
      .doc(id).update({
        upvotes: this.state.tempUpvotes + 1
      })
      //console.log(this.state.tempUpvotes + 1)
    return this.state.tempUpvotes + 1
  }
  downvote = (id) => {
    let db = firebase.firestore()
    db
      .collection('questions')
      .doc(id).get().then((doc) => {
        //console.log(doc.data())
        //console.log(doc.data().upvotes)
        this.setState({tempUpvotes: doc.data().upvotes})
      })
    db
      .collection('questions')
      .doc(id).update({
        upvotes: this.state.tempUpvotes - 1
      })
      //console.log("next" + this.state.tempUpvotes)
    return this.state.tempUpvotes - 1
  }

  setQuestionUpvotes(){
    for(let i = 0; i < this.state.filteredQuestions.length; i++){
      firebase.firestore()
        .collection('questions').doc(this.state.filteredQuestions[i].getId()).get().then((doc) => {
          this.state.filteredQuestions[i].setUpvotes(doc.data().upvotes)
        })
    }
  }  

  render() {
    let feed = <Feed theme={this.state.theme} user={this.user} filteredQuestions={this.state.filteredQuestions} />;

    if (this.state.loading_data) {
      feed = <Spinner className="loader" style={{ width: '5rem', height: '5rem' }} color="warning" />;

    }

    let solo = <FullThread theme={this.state.theme} user={this.user} filteredQuestions={this.state.filteredQuestions} />;
    if (this.state.loading_data) {
      solo = <Spinner className="loader" style={{ width: '5rem', height: '5rem' }} color="warning" />;
    }
    return (
      <React.Fragment>
        <div className="main" style={{ backgroundColor: this.state.styles.body.backgroundColor }}>
          <div id="titleArea" style={this.state.styles.header}>
            <h1 id="title">MVHW</h1>
            <NavBar
              questions={this.state.questions}
              updateFilter={this.updateFilter}
            />

            <Button color={this.state.theme === 1 ? 'light' : 'dark'} id="logIn">Sign In</Button>
          </div>

          <section className="sidePanel">
            <div className="sbox" style={this.state.styles.footer}>
              <p>Create a Post:</p>
              <hr style={this.state.theme === 1 ? theme1.line : theme2.line} />
              <Form onSubmit={this.submitHandler}>
                <FormGroup>
                  <Label for="text">Text:</Label>
                  <Input type="textarea" name="text" id="text" onChange={this.changeHandler} />
                  {this.state.errormessage}
                  <br />
                  <Label for="tags"><Badge color="info">Optional</Badge> Tag:</Label>
                  <Input type="select" name="select" id="tags">
                    <option>None</option>
                    <option>Math</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                    <option>Computer Science</option>
                  </Input>
                </FormGroup>
                <Button color={this.state.theme === 1 ? 'light' : 'dark'} block>Submit</Button>
              </Form>
            </div>

            <div className="sbox" style={this.state.styles.footer}>
              <a href="https://github.com/MV23-Devs/MVHW" className={this.state.theme === 1 ? 'link-dark' : 'link-light'}>Github</a>
              <br />
              <a href="https://www.instagram.com/mvhs.2023/?hl=en" className={this.state.theme === 1 ? 'link-dark' : 'link-light'}>Instagram</a>
              <br />
              <br />
              <h6 className="copyright">Copyright (c) 2020 Mountain View 2023 Developers</h6>
              <hr style={this.state.theme === 1 ? theme1.line : theme2.line} />
              <AboutModal theme={this.state.theme}></AboutModal>
              <br />
              <Button theme={this.state.theme} color={this.state.theme === 1 ? 'light' : 'dark'} block onClick={this.changeTheme}>Switch to {this.state.theme === 1 ? 'light' : 'dark'} theme</Button>
            </div>
          </section>

          <div id="field">
            {feed}
          </div>


          <footer className="footer" style={this.state.styles.footer} >
            <p className="footertext">hola</p>
          </footer>
        </div>

      </React.Fragment>
    );
  }

  sortQs() {

  }

  updateFilter = (filteredQuestions) => {
    this.setState(
      { filteredQuestions }
    )
  }

  // getFooterColor = () => {
  //   this.setState({
  //     styles: this.state.theme === 1 ? { ...dark } : { ...light }
  //   });
  //   console.log(this.state.styles.footer.backgroundColor);
  //   return this.state.styles.footer.backgroundColor;
  // }
}