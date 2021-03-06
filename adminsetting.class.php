<?php
// This file is part of the customcert module for Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Creates an upload form on the settings page.
 *
 * @package    mod_customcert
 * @copyright  2013 Mark Nelson <markn@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once($CFG->libdir.'/adminlib.php');
require_once($CFG->dirroot.'/mod/customcert/upload_image_form.php');

/**
 * Class extends admin setting class to allow/process an uploaded file
 */
class mod_customcert_admin_setting_upload extends admin_setting_configtext {

    /**
     * Output the link to the upload image page.
     *
     * @param mixed $data
     * @param string $query
     * @return string
     */
    public function output_html($data, $query = '') {
        return format_admin_setting($this, $this->visiblename,
            html_writer::link(new moodle_url('/mod/customcert/upload_image.php'), get_string('upload')),
                $this->description, true, '', null, $query);
    }
}
