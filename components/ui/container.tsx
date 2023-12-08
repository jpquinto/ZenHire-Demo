interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return (
        <div className="mx-auto max-w-[90%]">
            {children}
        </div>
    );
}
 
export default Container;