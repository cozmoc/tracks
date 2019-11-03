import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import classNames from 'classnames';
import { Icon } from '@material-ui/core';
import { connect } from 'react-redux';
import AreYouSureModal from '../modals/AreYouSureModal';
import EditTrackModal from '../modals/EditTrackModal';
import { deleteTrack } from '../../actions/tracks';

const useStyles = makeStyles(theme => ({
    card: {
        padding: theme.spacing(2, 2),
        margin: theme.spacing(2, 0),
    },
    chips: {
        display: 'block',
    },
    chip: {
        margin: theme.spacing(0.5, 0.5),
    }
}));

function TrackCard(props) {
    const classes = useStyles();
    const { track, auth } = props;
    const since = daysBeen(track.date);
    const types = Object.keys(track.types).filter(type => track.types[type]);

    const deleteCurrentTrack = () => {
        props.deleteTrack(track.id);
    }

    return (
        <Card className={classNames(classes.card, 'w-100')}>
            <div className="d-flex justify-content-between">
                <CardHeader
                    avatar={
                        <Avatar aria-label="" className={classes.avatar}>
                            <img src={track.created_by.avatar} className='w-100' alt='avatar' />
                        </Avatar>
                    }
                    title={track.created_by.name}
                    subheader={since ? `${since} days ago` : 'Today'}
                />
                {
                    auth.isAuthenticated && auth.user.id === track.created_by._id &&
                    <div className="row">
                        <EditTrackModal track={track} />
                        <AreYouSureModal
                            icon={<Icon>delete</Icon>}
                            onAccept={deleteCurrentTrack}
                        />
                    </div>
                }
            </div>
            <CardContent>
                <Typography variant="h5" color="textSecondary" component="h5">
                    {track.name}
                </Typography>
            </CardContent>
            <CardActions>
                <div className={classes.chips}>
                    {types.map(type => <Chip key={type} label={type} className={classes.chip} />)}
                </div>
            </CardActions>
        </Card>
    );
}

function daysBeen(value) {
    let one_day = 1000 * 60 * 60 * 24;
    let date_ms = new Date(value).getTime();
    let now = new Date().getTime();
    let difference_ms = now - date_ms;
    return Math.round(difference_ms / one_day);
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { deleteTrack })(TrackCard);
