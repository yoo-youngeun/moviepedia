import { useState } from "react";
import ReviewList from "./components/ReviewList"
import mockItems from './mock.json';
import Modal from "./components/Modal";
import CreateReviewForm from "./components/CreateReviewForm";
import EditReviewForm from "./components/EditReviewForm";

function App() {
  const [order, setOrder] = useState('createdAt');
  const [items, setItems] = useState(mockItems);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const sortedItems = [...items].sort((a, b) => b[order] - a[order]);
  
  const handleCreate = (data) => {
    console.log(data);
    setIsCreateReviewOpen(false);
    const newItem = {
        "id": items.length + 1,
        "title": data.title,
        "imgUrl": "",
        "rating": data.rating,
        "content": data.content,
        "createAt": now.valueOf(),
        "updatedAt": now.valueOf(),
    }
    setItems([newItem, ...items]);
  }

  const handleUpdate = (id, data) => {
    console.log(data);
    const index = items.findIndex((item) => item.id === id);
    const now = new Date();
    const newItem = {
      ...items[index],
      ...data,
      "updatedAt": now.valueOf()
    };

    const newItems = [
      ...items.slice(0, index),
      newItem,
      ...items.slice(index + 1)
    ];
    setItems(newItems);
  }

  const handleDelete = (id) => {
    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
  };

  return (
    <div>
      <div>
        <button onClick={() => setOrder('createdAt')}>최신순</button>
        <button onClick={() => setOrder('rating')}>베스트순</button>
        <button onClick={() => setIsCreateReviewOpen(true)}>추가하기</button>
        <Modal 
          isOpen={isCreateReviewOpen} 
          onClose={() => setIsCreateReviewOpen(false)}
        >
          <h2>리뷰 생성</h2>
          <CreateReviewForm onSubmit={handleCreate}/>
        </Modal> 
      </div>
      <ReviewList items={sortedItems} onUpdate={handleUpdate} onDelete={handleDelete}/>
    </div>
  );
}

export default App