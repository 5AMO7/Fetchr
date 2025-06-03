function DividerLine({ width }) {
    return (
        <hr className={`${width || 'w-full'} h-px border border-border-medium`}/>
    );
}

export default DividerLine;