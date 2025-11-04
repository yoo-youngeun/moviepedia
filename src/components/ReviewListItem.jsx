import { useState } from 'react';
import styles from './ReviewListItem.module.css';
import Modal from './Modal';
import EditReviewForm from './EditReviewForm';
function ReviewListItem({item, onUpdate, onDelete}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const dateString = (new Date(item.createdAt)).toLocaleDateString(); // 유닉스 타임스탬프 형식 > 날짜형식 변환
    const handleEditFormSubmit = (data) => {
        onUpdate(item.id, data);
        setIsEditModalOpen(false);
    }

    return (
        <div className={styles.item}>
            <img src={item.imgUrl} alt={item.title} className={styles.image}/>
            <div>
                <h1>{item.title}</h1>
                <p>{item.rating}</p>
                <p>{dateString}</p>
                <p>{item.content}</p>
                <button onClick={() => setIsEditModalOpen(true)}>수정</button>
                <Modal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)}>
                    <EditReviewForm 
                        review={item} 
                        onSubmit={handleEditFormSubmit} />
                </Modal>
                <button onClick={() => onDelete(item.id)}>삭제</button>
            </div>
        </div>
    )
}

export default ReviewListItem;