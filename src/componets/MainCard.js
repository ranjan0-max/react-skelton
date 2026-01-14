import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { Panel } from "rsuite";
import theme from '../componets/Theme';

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = React.forwardRef(
    (
        {
            border = false,
            boxShadow,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            ...others
        },
        ref
    ) => {
        return (
            <div>
                {title && (
                    <div style={{
                        display: "flex",
                        justifyContent: "start",
                        padding: "10px",
                        margin: "20px 0px"
                    }}>
                        {darkTitle ? <h3>{title}</h3> : <h5>{title}</h5>}
                    </div>
                )
                }
                <Panel
                    ref={ref}
                    shaded
                    bordered
                    style={{
                        marginTop: "1%",
                        height: "80%",
                        padding: "10px",
                        border: "2px solid #e5e5e5",
                        ...sx
                    }}
                    {...others}
                >
                    {content ? (
                        <div
                            style={{
                                border: "2px solid rgb(245 243 243)",
                                borderRadius: "5px",
                                marginTop: "1%",
                                padding: "10px",
                            }}
                        >
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                </Panel>
            </div >
        );
    }
);

MainCard.propTypes = {
    border: PropTypes.bool,
    boxShadow: PropTypes.bool,
    children: PropTypes.node,
    content: PropTypes.bool,
    contentClass: PropTypes.string,
    contentSX: PropTypes.object,
    darkTitle: PropTypes.bool,
    secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
    shadow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sx: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

export default MainCard;
