import { useEffect, useRef } from "react";

function EditReviewForm({review, onSubmit}) {
    const inputRef = useRef(null);
    useEffect(()=>{
        if (inputRef.current){
            inputRef.current.focus();
        }
    }, [])

    const submit = (formData) => {
        const data = Object.fromEntries(formData.entries()); // javascript 객체로 변환
        onSubmit(data);
    }

    return (
        <form action={submit}>
            <input 
                name="title" 
                defaultValue={review.title} 
                placeholder="제목을 입력하세요" 
                ref={inputRef} />
            <select name="rating" defaultValue={review.rating}>
                <option value={1}>⭐️</option>
                <option value={2}>⭐️⭐️</option>
                <option value={3}>⭐️⭐️⭐️</option>
                <option value={4}>⭐️⭐️⭐️⭐️</option>
                <option value={5}>⭐️⭐️⭐️⭐️⭐️</option>
            </select>
            <textarea 
                name="content" 
                defaultValue={review.content} 
                placeholder="내용을 입력하세요." />
            <button>작성완료</button>
        </form>
    )
}

export default EditReviewForm;