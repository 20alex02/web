<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:include href="templates/user.xsl" />
    <xsl:include href="templates/group.xsl" />
    <xsl:include href="templates/event.xsl" />
    <xsl:output method="text" indent="yes"/>
    <xsl:template match="/social">
    {
        "users": [
            <xsl:apply-templates select="users/user"/>
        ],
        "groups": [
            <xsl:apply-templates select="groups/group"/>
        ],
        "events": [
            <xsl:apply-templates select="events/event"/>
        ]
    }
    </xsl:template>
</xsl:stylesheet>
