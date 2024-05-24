import { ReactElement, ReactNode, ReactPortal, Key } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import styles from '../css/bubble.module.css'; // Correct import for CSS module

const BubbleText = (props: { text: any; }) => {
    const text = props.text
    return (
        <h2 className="text-4xl font-bold"
        >

            {text.split("").map((child: string | number | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | null | undefined, idx: Key | null | undefined) => (
                <span className={styles.hoverText} key={idx}>
          {child}
        </span>
            ))}
        </h2>
    );
};

export default BubbleText

