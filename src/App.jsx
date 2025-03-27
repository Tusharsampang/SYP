import { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import AddNote from "./pages/AddNotes";
import EditNote from "./pages/EditNotes";
import HomePage from "./pages/HomePage";
import NoteDetail from "./pages/NotesDetail";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import { TbError404Off } from "react-icons/tb"

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleFilterText = (val) => {
    setFilterText(val);
  };

  const handelSearchText = (val) => {
    setSearchText(val);
  };

  const filteredNotes =
    filterText === "BUSINESS"
      ? notes.filter((note) => note.category == "BUSINESS")
      : filterText === "PERSONAL"
      ? notes.filter((note) => note.category == "PERSONAL")
      : filterText === "IMPORTANT"
      ? notes.filter((note) => note.category == "IMPORTANT")
      : notes;


      useEffect(() => {
        if(searchText.length < 3) return;
        axios.get(`http://127.0.0.1:8004/notes-search/?search=${searchText}`)
        .then(res => {
          console.log(res.data)
          setNotes(res.data)
        })
        .catch(err => console.log(err.message))
      }, [searchText])

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://127.0.0.1:8004/notes/")
      .then((res) => {
        // console.log(res.data);
        setNotes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const addNote = (data) => {
    axios
      .post("http://127.0.0.1:8004/notes/", data)
      .then((res) => {
        setNotes([...notes, data]);
        toast.success("A new note has been added");
        console.log(res.data);
      })

      .catch((err) => {
        console.log(console.log(err.message));
      });
  };

  const updateNote = (data, slug) => {
    axios
      .put(`http://127.0.0.1:8004/notes/${slug}/`, data)
      .then((res) => {
        console.log(res.data);
        toast.success("Note updated succesfully");
      })

      .catch((err) => console.log(err.message));
  };

  const deleteNote = (slug) => {
    axios
      .delete(`http://127.0.0.1:8004/notes/${slug}`)
      .catch((err) => console.log(err.message));
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MainLayout
            searchText={searchText}
            handelSearchText={handelSearchText}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              notes={filteredNotes}
              loading={isLoading}
              handleFilterText={handleFilterText}
            />
          }
        />
        <Route path="/add-note" element={<AddNote addNote={addNote} />} />
        <Route
          path="/edit-note/:slug"
          element={<EditNote updateNote={updateNote} />}
        />
        <Route
          path="/notes/:slug"
          element={<NoteDetail deleteNote={deleteNote} />}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;