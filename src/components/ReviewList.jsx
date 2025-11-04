import ReviewListItem from "./ReviewListItem";
function ReviewList({items, onUpdate, onDelete}) {
    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}> 
                    <ReviewListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />
                </li>
            ))}
        </ul>
    );
}

export default ReviewList;