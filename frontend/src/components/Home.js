import React from 'react';
import { connect } from 'react-redux';
import { getTracks } from '../actions/tracks';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrackCard from './widgets/TrackCard';
import SearchBar from './widgets/SearchBar';

function Home(props) {

    React.useEffect(() => props.getTracks(), []);
    const [filters, setFilters] = React.useState({
        keyword: '',
        types: {}
    });

    function applyFilters(newfilters) {
        setFilters({ ...filters, ...newfilters })
    }

    const { classes, tracks } = props;
    let allTypes = tracks.reduce((types, track) => [
      ...new Set([...types, ...Object.keys(track.types)])
    ], []);

    React.useEffect(() => applyFilters({types: allTypes.reduce((types, type) => ({...types, [type]: true}), {})}), [tracks]);
    const filteredTracks = tracks.filter(track =>
        track.name.includes(filters.keyword) &&
        Object.keys(track.types)
            .filter(type => track.types[type])
            .some(type => Object.keys(filters.types)
            .filter(filteredType => filters.types[filteredType])
            .includes(type)
        )
    );

    return (
        <div className='d-flex justify-content-center align-items-center flex-column'>
            <SearchBar onChange={applyFilters} filters={filters}/>
            {
              filteredTracks.map((track, i) =>
              <div key={i} className={classes.root}>
                        <TrackCard track={track} />
                    </div>
                )
            }
            {!tracks.length && <CircularProgress />}
        </div>
    );

}

const mapStateToProps = (state) => ({
    tracks: state.tracks
});

const styles = theme => ({
    root: {
        width: '80%'
    },
});

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getTracks })(withStyles(styles)(Home));
