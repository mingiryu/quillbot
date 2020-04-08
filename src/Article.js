import React from "react";
import "./Article.css";

import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import CreateRoundedIcon from "@material-ui/icons/CreateRounded";
import Fab from "@material-ui/core/Fab";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const FabTooltip = withStyles((theme) => ({
    tooltip: {
        background: "rgba(0,0,0,0)",
    },
}))(Tooltip);

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {},
}))(Tooltip);

const removePunct = (text) => {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
};

const fetchQuill = (payload) => {
    return fetch("https://quillbot.p.rapidapi.com/paraphrase", {
        method: "POST",
        headers: {
            "x-rapidapi-host": "quillbot.p.rapidapi.com",
            "x-rapidapi-key":
                "4e26127674msh44f405456fbb569p15cdd2jsn41c7e4a8bdd5",
            "content-type": "application/json",
            accept: "application/json",
        },
        body: {
            text: payload,
            numParaphrases: 1,
            includeSegs: true,
            strength: 1,
            autoflip: 1,
        },
    })
        .then((response) => {
            console.log(response);
            if (response.ok) {
                return require("./data.json");
            } else {
                return null;
            }

        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

export default class Article extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            snackOpen: false,
            fabOpen: false,
            altsOpen: false,
            fabRect: { top: "0px", left: "0px" },
            altsRect: { top: "0px", left: "0px" },
            range: null,
            alts: [],
        };
    }

    handleSnackClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        this.setState({ snackOpen: false });
    };

    handleTooltipClose = () => {
        this.setState({ fabOpen: false, altsOpen: false });
    };

    handleHighlight = (event) => {
        if (!this.state.fabOpen && window.getSelection) {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text && text !== "") {
                this.setState({
                    fabOpen: true,
                });
                const fabRect = event.target.getBoundingClientRect();
                this.setState({
                    fabRect: {
                        top: `${fabRect.top + window.scrollY}px`,
                        left: `${fabRect.right + window.scrollX}px`,
                    },
                    range: selection.getRangeAt(0),
                });
            }
        }
        event.preventDefault();
    };

    showAlts = (event) => {
        if (event.target.alts.length) {
            const altsRect = event.target.getBoundingClientRect();
            this.setState({
                altsOpen: true,
                altsRect: {
                    top: `${altsRect.top + window.scrollY + 5}px`,
                    left: `${altsRect.left + window.scrollX + 20}px`,
                },
                alts: event.target.alts,
            });
        }
        event.preventDefault();
    };

    updateView = (json, range) => {
        if (range) {
            const orig = json.original;
            const pps = json.paraphrases[0];
            const segs = pps.segs;

            let start = range.startContainer.parentElement;
            let end = range.endContainer.parentElement.nextElementSibling;

            for (let i = 0; i < segs.length; i++) {
                const seg = segs[i];

                if (start) {
                    // Check for punctuation
                    if (i < segs.length - 1) {
                        const nextSeg = segs[i + 1].text;
                        const hasPunct = removePunct(nextSeg) === "";
                        var punct = hasPunct ? nextSeg : "";
                        if (hasPunct) i++;
                    }

                    // Set attributes and properties according to each seg
                    if (orig.toLowerCase().includes(seg.text.toLowerCase())) {
                        if (seg.alts.length) {
                            start.setAttribute("class", "article-unchanged");
                        }
                    } else {
                        start.setAttribute("class", "article-word");
                    }
                    start.innerHTML = `${seg.text}${punct}`;
                    start.alts = seg.alts.map((a) => a.text);
                    start.onclick = this.showAlts;

                    start = start.nextElementSibling;
                }
            }
            // Empty unused ranges
            while (start !== end && start) {
                start.innerHTML = "";
                start = start.nextElementSibling;
            }
            // Clear selection
            window.getSelection().empty();
        }
    };

    handleClick = (event) => {
        const range = this.state.range;
        fetchQuill(range.toString()).then((json) => {
            if (json) {
                this.updateView(json, range);
            } else {
                this.setState({ snackOpen: true });
            }
        });
        event.preventDefault();
    };

    componentDidMount() {
        window.addEventListener("mouseup", this.handleHighlight);
        window.addEventListener("mousedown", this.handleTooltipClose);

        [...document.getElementsByTagName("p")].forEach((p) => {
            p.outerHTML = `<div class="article-paragraph">${p.innerHTML
                .split(" ")
                .map((word) => `<span>${word}</span>`)
                .join(" ")}</div>`;
        });
    }

    render() {
        return (
            <React.Fragment>
                <Snackbar
                    open={this.state.snackOpen}
                    autoHideDuration={6000}
                    onClose={this.handleSnackClose}
                >
                    <Alert onClose={this.handleSnackClose} severity="error">
                        Unfortunately, request to the QuillBot API failed.
                    </Alert>
                </Snackbar>

                <FabTooltip
                    open={this.state.fabOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    interactive
                    style={{ ...this.state.fabRect, position: "absolute" }}
                    title={
                        <Fab color="primary" size="small">
                            <CreateRoundedIcon onClick={this.handleClick} />
                        </Fab>
                    }
                >
                    <span />
                </FabTooltip>

                <HtmlTooltip
                    open={this.state.altsOpen}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    style={{ ...this.state.altsRect, position: "absolute" }}
                    title={
                        <React.Fragment>
                            {this.state.alts.map((alt) => (
                                <span style={{ display: "block" }}>{alt}</span>
                            ))}
                        </React.Fragment>
                    }
                >
                    <span />
                </HtmlTooltip>

                <h1>Harry S. Truman: The Truman Doctrine</h1>

                <p>
                    <i>
                        Throughout 1946 Communist forces, supported by the
                        Soviet satellite states of Bulgaria, Yugoslavia, and
                        Albania, carried on a full-scale guerrilla war against
                        the Greek government. At the same time the U.S.S.R.
                        demanded from Turkey the right to establish bases and
                        the surrender of Turkish territory at the eastern end of
                        the Black Sea. Soviet expansionism threatened not only
                        the Mediterranean but the oil-rich Middle East. The
                        civil war in Greece had reached a critical stage when
                        Great Britain informed the United States on February 24,
                        1947, that it could no longer give aid to the Greek
                        government. President Truman was advised by military
                        experts that Greece might fall to the Communists unless
                        American aid was immediately forthcoming. Despite
                        anticipated opposition from Congress, Truman decided to
                        commit the United States to the defense of Greece and
                        Turkey. On March 12, before a joint session of Congress,
                        he set forth what has become known as the Truman
                        Doctrine. The doctrine marked the reversal of American
                        foreign policy, from cooperation with the Soviet Union
                        to "containment" of Soviet power.
                    </i>
                </p>

                <p>
                    The gravity of the situation which confronts the world today
                    necessitates my appearance before a joint session of the
                    Congress. The foreign policy and the national security of
                    this country are involved.
                </p>

                <p>
                    One aspect of the present situation which I wish to present
                    to you at this time for your consideration and decision
                    concerns Greece and Turkey. The United States has received
                    from the Greek government an urgent appeal for financial and
                    economic assistance. Preliminary reports from the American
                    economic mission now in Greece and reports from the American
                    ambassador in Greece corroborate the statement of the Greek
                    government that assistance is imperative if Greece is to
                    survive as a free nation.
                </p>

                <p>
                    I do not believe that the American people and the Congress
                    wish to turn a deaf ear to the appeal of the Greek
                    government.
                </p>

                <p>
                    Greece is not a rich country. Lack of sufficient natural
                    resources has always forced the Greek people to work hard to
                    make both ends meet. Since 1940, this industrious and
                    peace-loving country has suffered invasion, four years of
                    cruel enemy occupation, and bitter internal strife.
                </p>

                <p>
                    When forces of liberation entered Greece they found that the
                    retreating Germans had destroyed virtually all the railways,
                    roads, port facilities, communications, and merchant marine.
                    More than a thousand villages had been burned. Eighty-five
                    percent of the children were tubercular. Livestock, poultry,
                    and draft animals had almost disappeared. Inflation had
                    wiped out practically all savings. As a result of these
                    tragic conditions, a militant minority, exploiting human
                    want and misery, was able to create political chaos which,
                    until now, has made economic recovery impossible.
                </p>

                <p>
                    Greece is today without funds to finance the importation of
                    those goods which are essential to bare subsistence. Under
                    these circumstances the people of Greece cannot make
                    progress in solving their problems of reconstruction. Greece
                    is in desperate need of financial and economic assistance to
                    enable it to resume purchases of food, clothing, fuel, and
                    seeds. These are indispensable for the subsistence of its
                    people and are obtainable only from abroad. Greece must have
                    help to import the goods necessary to restore internal order
                    and security so essential for economic and political
                    recovery.
                </p>

                <p>
                    The Greek government has also asked for the assistance of
                    experienced American administrators, economists, and
                    technicians to insure that the financial and other aid given
                    to Greece shall be used effectively in creating a stable and
                    self-sustaining economy and in improving its public
                    administration.
                </p>

                <p>
                    The very existence of the Greek state is today threatened by
                    the terrorist activities of several thousand armed men, led
                    by Communists, who defy the government's authority at a
                    number of points, particularly along the northern
                    boundaries. A commission appointed by the United Nations
                    Security Council is at present investigating disturbed
                    conditions in northern Greece and alleged border violations
                    along the frontier between Greece, on the one hand, and
                    Albania, Bulgaria, and Yugoslavia, on the other. Meanwhile,
                    the Greek government is unable to cope with the situation.
                    The Greek Army is small and poorly equipped. It needs
                    supplies and equipment if it is to restore the authority of
                    the government throughout Greek territory.
                </p>

                <p>
                    Greece must have assistance if it is to become a
                    self-supporting and self-respecting democracy. The United
                    States must supply this assistance. We have already extended
                    to Greece certain types of relief and economic aid but these
                    are inadequate. There is no other country to which
                    democratic Greece can turn. No other nation is willing and
                    able to provide the necessary support for a democratic Greek
                    government.
                </p>

                <p>
                    The British government, which has been helping Greece, can
                    give no further financial or economic aid after March 31.
                    Great Britain finds itself under the necessity of reducing
                    or liquidating its commitments in several parts of the
                    world, including Greece.
                </p>

                <p>
                    We have considered how the United Nations might assist in
                    this crisis. But the situation is an urgent one requiring
                    immediate action, and the United Nations and its related
                    organizations are not in a position to extend help of the
                    kind that is required.
                </p>

                <p>
                    It is important to note that the Greek government has asked
                    for our aid in utilizing effectively the financial and other
                    assistance we may give to Greece and in improving its public
                    administration. It is of the utmost importance that we
                    supervise the use of any funds made available to Greece in
                    such a manner that each dollar spent will count toward
                    making Greece self-supporting and will help to build an
                    economy in which a healthy democracy can flourish.
                </p>

                <p>
                    No government is perfect. One of the chief virtues of a
                    democracy, however, is that its defects are always visible
                    and under democratic processes can be pointed out and
                    corrected. The government of Greece is not perfect.
                    Nevertheless, it represents 85 percent of the members of the
                    Greek Parliament who were chosen in an election last year.
                    Foreign observers, including 692 Americans, considered this
                    election to be a fair expression of the views of the Greek
                    people.
                </p>

                <p>
                    The Greek government has been operating in an atmosphere of
                    chaos and extremism. It has made mistakes. The extension of
                    aid by this country does not mean that the United States
                    condones everything that the Greek government has done or
                    will do. We have condemned in the past, and we condemn now,
                    extremist measures of the right or the left. We have in the
                    past advised tolerance, and we advise tolerance now.
                </p>

                <p>
                    Greece's neighbor, Turkey, also deserves our attention. The
                    future of Turkey as an independent and economically sound
                    state is clearly no less important to the freedom-loving
                    peoples of the world than the future of Greece. The
                    circumstances in which Turkey finds itself today are
                    considerably different from those of Greece. Turkey has been
                    spared the disasters that have beset Greece. And during the
                    war, the United States and Great Britain furnished Turkey
                    with material aid. Nevertheless, Turkey now needs our
                    support.
                </p>

                <p>
                    Since the war, Turkey has sought financial assistance from
                    Great Britain and the United States for the purpose of
                    effecting that modernization necessary for the maintenance
                    of its national integrity. That integrity is essential to
                    the preservation of order in the Middle East.
                </p>

                <p>
                    The British government has informed us that, owing to its
                    own difficulties, it can no longer extend financial or
                    economic aid to Turkey. As in the case of Greece, if Turkey
                    is to have the assistance it needs, the United States must
                    supply it. We are the only country able to provide that
                    help.
                </p>

                <p>
                    I am fully aware of the broad implications involved if the
                    United States extends assistance to Greece and Turkey, and I
                    shall discuss these implications with you at this time.
                </p>

                <p>
                    One of the primary objectives of the foreign policy of the
                    United States is the creation of conditions in which we and
                    other nations will be able to work out a way of life free
                    from coercion. This was a fundamental issue in the war with
                    Germany and Japan. Our victory was won over countries which
                    sought to impose their will and their way of life upon other
                    nations.
                </p>

                <p>
                    To insure the peaceful development of nations, free from
                    coercion, the United States has taken a leading part in
                    establishing the United Nations. The United Nations is
                    designed to make possible lasting freedom and independence
                    for all its members. We shall not realize our objectives,
                    however, unless we are willing to help free peoples to
                    maintain their free institutions and their national
                    integrity against aggressive movements that seek to impose
                    upon them totalitarian regimes. This is no more than a frank
                    recognition that totalitarian regimes imposed on free
                    peoples, by direct or indirect aggression, undermine the
                    foundations of international peace and hence the security of
                    the United States.
                </p>

                <p>
                    The peoples of a number of countries of the world have
                    recently had totalitarian regimes forced upon them against
                    their will. The government of the United States has made
                    frequent protests against coercion and intimidation, in
                    violation of the Yalta Agreement, in Poland, Rumania, and
                    Bulgaria. I must also state that in a number of other
                    countries there have been similar developments.
                </p>

                <p>
                    At the present moment in world history nearly every nation
                    must choose between alternative ways of life. The choice is
                    too often not a free one.
                </p>

                <p>
                    One way of life is based upon the will of the majority, and
                    is distinguished by free institutions, representative
                    government, free elections, guarantees of individual
                    liberty, freedom of speech and religion, and freedom from
                    political oppression. The second way of life is based upon
                    the will of a minority forcibly imposed upon the majority.
                    It relies upon terror and oppression, a controlled press and
                    radio, fixed elections, and the suppression of personal
                    freedoms.
                </p>

                <p>
                    I believe that it must be the policy of the United States to
                    support free peoples who are resisting attempted subjugation
                    by armed minorities or by outside pressures. I believe that
                    we must assist free peoples to work out their own destinies
                    in their own way. I believe that our help should be
                    primarily through economic and financial aid, which is
                    essential to economic stability and orderly political
                    processes.
                </p>

                <p>
                    The world is not static and the status quo is not sacred.
                    But we cannot allow changes in the status quo in violation
                    of the Charter of the United Nations by such methods as
                    coercion or by such subterfuges as political infiltration.
                    In helping free and independent nations to maintain their
                    freedom, the United States will be giving effect to the
                    principles of the Charter of the United Nations.
                </p>

                <p>
                    It is necessary only to glance at a map to realize that the
                    survival and integrity of the Greek nation are of grave
                    importance in a much wider situation. If Greece should fall
                    under the control of an armed minority, the effect upon its
                    neighbor, Turkey, would be immediate and serious. Confusion
                    and disorder might well spread throughout the entire Middle
                    East. Moreover, the disappearance of Greece as an
                    independent state would have a profound effect upon those
                    countries in Europe whose peoples are struggling against
                    great difficulties to maintain their freedoms and their
                    independence while they repair the damages of war.
                </p>

                <p>
                    It would be an unspeakable tragedy if these countries, which
                    have struggled so long against overwhelming odds, should
                    lose that victory for which they sacrificed so much.
                    Collapse of free institutions and loss of independence would
                    be disastrous not only for them but for the world.
                    Discouragement and possibly failure would quickly be the lot
                    of neighboring peoples striving to maintain their freedom
                    and independence.
                </p>

                <p>
                    Should we fail to aid Greece and Turkey in this fateful
                    hour, the effect will be far-reaching to the West as well as
                    to the East. We must take immediate and resolute action.
                </p>

                <p>
                    I therefore ask the Congress to provide authority for
                    assistance to Greece and Turkey in the amount of $400
                    million for the period ending June 30, 1948. In requesting
                    these funds, I have taken into consideration the maximum
                    amount of relief assistance which would be furnished to
                    Greece out of the $350 million which I recently requested
                    that the Congress authorize for the prevention of starvation
                    and suffering in countries devastated by the war.
                </p>

                <p>
                    In addition to funds, I ask the Congress to authorize the
                    detail of American civilian and military personnel to Greece
                    and Turkey, at the request of those countries, to assist in
                    the tasks of reconstruction, and for the purpose of
                    supervising the use of such financial and material
                    assistance as may be furnished. I recommend that authority
                    also be provided for the instruction and training of
                    selected Greek and Turkish personnel.
                </p>

                <p>
                    Finally, I ask that the Congress provide authority which
                    will permit the speediest and most effective use, in terms
                    of needed commodities, supplies, and equipment, of such
                    funds as may be authorized.
                </p>

                <p>
                    If further funds, or further authority, should be needed for
                    purposes indicated in this message, I shall not hesitate to
                    bring the situation before the Congress. On this subject the
                    executive and legislative branches of the government must
                    work together.
                </p>

                <p>
                    This is a serious course upon which we embark. I would not
                    recommend it except that the alternative is much more
                    serious.
                </p>

                <p>
                    The United States contributed $341 billion toward winning
                    World War II. This is an investment in world freedom and
                    world peace. The assistance that I am recommending for
                    Greece and Turkey amounts to little more than one-tenth of 1
                    percent of this investment. It is only common sense that we
                    should safeguard this investment and make sure that it was
                    not in vain.
                </p>

                <p>
                    The seeds of totalitarian regimes are nurtured by misery and
                    want. They spread and grow in the evil soil of poverty and
                    strife. They reach their full growth when the hope of a
                    people for a better life has died. We must keep that hope
                    alive.
                </p>

                <p>
                    The free peoples of the world look to us for support in
                    maintaining their freedoms. If we falter in our leadership,
                    we may endanger the peace of the world -- and we shall
                    surely endanger the welfare of our own nation.
                </p>

                <p>
                    Great responsibilities have been placed upon us by the swift
                    movement of events. I am confident that the Congress will
                    face these responsibilities squarely.
                </p>

                <h6>
                    Source: <i>Congressional Record,</i> 80 Cong., 1 Sess., pp.
                    1980-1981.
                </h6>
            </React.Fragment>
        );
    }
}
