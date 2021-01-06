function main() {
    const container = document.getElementById('container');
    const canvas = document.getElementById('canvas');

    canvas.style.transform = 'scale(1, 1)';

    function handleUpdateScale(scale) {
        // canvas.style.transformOrigin = `0 0`;
        const t = canvas.style.transform;
        console.warn('t', t);
        canvas.style.transform = `${t} scale(${scale}, ${scale})`;
        setTimeout(() => {
            canvas.style.transformOrigin = `center`;
        }, 1000);
    }

    {
        window._handleUpdateScale = handleUpdateScale;
    }

    function handleMousedown(event) {
        // const dom = event.target;
        const dom = canvas;

        event.stopPropagation();

        let pos = {
            top: dom.getBoundingClientRect().top,
            left: dom.getBoundingClientRect().left
        };

        const startY = event.clientY;
        const startX = event.clientX;

        const startPositionTop = pos.top;
        const startPositionLeft = pos.left;

        console.warn('xxx-xxx: ', dom.getBoundingClientRect(), pos);

        function handleMouseup() {
            document.removeEventListener('mouseup', handleMouseup);
            document.removeEventListener('mousemove', handleMousemove);
        }

        function handleMousemove(moveEvent) {
            const currX = moveEvent.clientX;
            const currY = moveEvent.clientY;
            pos.top = currY - startY + startPositionTop;
            pos.left = currX - startX + startPositionLeft;

            // console.warn('Position: ', currY, startY, startPositionTop);
            // console.warn('Position: ', currX, startX, startPositionLeft);

            console.warn('transform', canvas.style.transform);

            canvas.style.transform = `translate(${pos.left}px, ${pos.top}px)`;

        }


        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    }

    container.addEventListener('mousedown', handleMousedown);
}

main();