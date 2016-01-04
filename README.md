#Playout

Javascript Layout Scripts

The Playout (P Layout) framework is a simple system for defining single-screen web pages where all divs remain on screen as the window viewport is resized.

Three types of layout are supported:

1)BorderLayout - classic layout inspired by Java Swing's BorderLayout. Divs are arranged by specifying the classes playoutnorth,     playoutsouth, playouteast, playoutwest, and playoutcenter
    Divs with the playoutnorth and playoutsouth class must also define the data-playoutheight attribute. This can be defined in either   percentage of parent height or in pixels.
    Divs with the playouteast and playoutwest class must also define the data-playoutwidth attribute. This can be defined in either   percentage of parent width or in pixels.

2)RowLayout - all child divs that include a playout class(playoutborder, playoutcenter, playoutnorth, playoutsouth, playoutwest, playouteast, playoutrows, playoutcolumns, playoutaware) within a div specifying playoutrows will be stacked, where the width of the child will be the width of the parent and the height of the child will be divided among all selected children of the parent.

3)ColumnLayout - same as RowLayout, but child divs are arranged horizontally instead of vertically.

Furthermore, any div specifying a playout class (playoutborder, playoutcenter, playoutnorth, playoutsouth, playoutwest, playouteast, playoutrows, playoutcolumns, playoutaware) will also have a function called playoutOccurred(width, height), if the function is present. 

Playout works with div borders, however, it does not attempt to compensate for the size of borders, since the border is drawn outside of the defined div area.


Playout supports internal div offsets. the data-offsetleft, data-offsetright, data-offsettop, data-offsetbottom attributes will specify the space between the defined div and its parent along each edge.
